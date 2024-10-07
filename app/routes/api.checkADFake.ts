import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { updateAntragDetails } from "~/models/antragDetails.server";
import {
  getDbShopifyOrders,
  updateConnectionDbShopifyOrdersUndAntrag,
} from "~/models/shopifyOrder.server";
import { addNoteToOrder } from "~/shopify/graphql/addNoteToOrder";
import { completeDraftOrder } from "~/shopify/graphql/completeDraftOrder";
import { cancelOrder } from "~/shopify/graphql/orderCancel";
import type { CompleteDraftOrderResponse } from "~/types/routesInterfaces";
// import { cancelOrder } from "~/shopify/graphql/orderCancel";
// import { orderMarkAsPaid } from "~/shopify/graphql/orderMarkAsPaid";
import { checkAntragStatus, getCurrentFormattedTime } from "~/utils/helpers";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  console.log("CheckAdFake", data);
  const {
    antragnrFront,
    statusFront,
    statusTxtFront,
  }: { antragnrFront: number; statusFront: number; statusTxtFront: string } =
    data;

  const antragnrData = {
    id: 1,
    jsonrpc: "2.0",
    result: {
      antragnr: antragnrFront ?? 500765,
      objekt: "EDV EDV (Hard- und Software)",
      kaufpreis: 1625.0,
      mietsz: 0.0,
      laufzeit: 36,
      rate: 55.45,
      mail_an_ln: true,
      ln_name: "test company",
      ln_strasse: "test street",
      ln_plz: "20146",
      ln_ort: "Test Location",
      ln_telefon: "015231111111",
      ln_mobil: null,
      ln_fax: null,
      ln_email: "test@test.com",
      gf_name: "Test. AA Testing",
      gf_vname: "Test. AA",
      gf_nname: "Testing",
      gf_anrede_text: "Herr",
      gf_anrede: 1,
      gf_strasse: "test street",
      gf_plz: "20146",
      gf_ort: "Test Location",
      gf_gebdat: "2003-04-24",
      eingegangen: "2024-04-24 18:14:28",
      promotion_id: null,
      status: 52,
      status_txt: "in Bearbeitung",
      ln_rechtsform: 1,
      iban: "DE02120300000000202051",
      bic: "BYLADEM1001",
      prodgrp: 1,
      ssv: true,
      schlusszahlung: 330.67,
      vertragsart: 1,
      zahlweise: 1,
      provproz: 5.0,
      ta_rw_proz: null,
      referenz: null,
      restwert: 0.0,
      kuendbar_auf: 30,
      saleleaseback: false,
      vk_id: 75451,
      vertrag_an_ln: true,
      bankname: "Deutsche Kreditbank Berlin",
      entsch_dok: [],
      vertr_dok: [],
    },
  };
  const shop = "cp-albis-motorland.myshopify.com";

  try {
    const shopifyOrders = await getDbShopifyOrders({
      antragnr: antragnrData.result.antragnr,
    });
    console.log("shopifyOrders", shopifyOrders);
    if (!shopifyOrders) {
      return new Response("Error processing shopify Orders Data", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    const { result } = antragnrData;
    const statusData = checkAntragStatus(statusFront, statusTxtFront);
    const checkDates = ["mock Data"];
    const newLastCheckAt = [...checkDates, getCurrentFormattedTime()];
    console.log("statusData", statusData);
    if (!statusData.isStatusFinish) {
      await updateAntragDetails({
        antragnr: Number(result.antragnr),
        lastCheckAt: JSON.stringify(newLastCheckAt),
      });
      await addNoteToOrder(
        shop,
        shopifyOrders.orderId ?? "",
        statusData.statusNote,
      );
      return json(
        {
          antragnr: result.antragnr,
          complete: false,
          currentStatus: result.status,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    const updatedAntragData = await updateAntragDetails({
      antragnr: result.antragnr,
      complete: true,
      eingegangen: result.eingegangen,
      gf_name: result.gf_name,
      gf_vname: result.gf_vname,
      kaufpreis: result.kaufpreis,
      ln_email: result.ln_email,
      ln_mobil: result.ln_mobil,
      ln_name: result.ln_name,
      ln_telefon: result.ln_telefon,
      status: result.status,
      status_txt: result.status_txt,
      lastCheckAt: JSON.stringify([...checkDates, getCurrentFormattedTime()]),
    });
    if (!updatedAntragData) {
      return new Response("Error processing updated Antrag Data", {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    switch (statusData.action) {
      case "Cancel":
        await cancelOrder(shop, shopifyOrders.orderId ?? "", {
          notifyCustomer: true,
          reason: "OTHER",
          refund: false,
          restock: true,
        });
        break;
      case "Paid":
        console.log("Switch paid");
        const completeOrderResponse = await completeDraftOrder(
          shop,
          shopifyOrders.draftOrderId,
        );
        const {
          data: CompleteDraftOrderData,
        }: { data?: CompleteDraftOrderResponse } = completeOrderResponse;
        const orderId =
          CompleteDraftOrderData?.draftOrderComplete.draftOrder.order.id;
        const orderName =
          CompleteDraftOrderData?.draftOrderComplete.draftOrder.order.name;

        console.log("orderId, orderName", orderId, orderName);

        console.log("after complete", CompleteDraftOrderData);
        const updatedShopifyOrderData =
          await updateConnectionDbShopifyOrdersUndAntrag(
            shopifyOrders.draftOrderId,
            shopifyOrders.antragnr ?? 0,
            {
              id: orderId ?? "",
              name: orderName ?? "",
            },
          );

        console.log("after updatedShopifyOrderData", updatedShopifyOrderData);
        await addNoteToOrder(
          shop,
          updatedShopifyOrderData?.orderId ?? "",
          statusData.statusNote,
        );

        console.log("updatedShopifyOrderData", updatedShopifyOrderData);

        break;

      case "Refund":
        await cancelOrder(shop, shopifyOrders.orderId ?? "", {
          notifyCustomer: true,
          reason: "OTHER",
          refund: true,
          restock: true,
        });
        break;

      default:
        console.error("No Action found");
        break;
    }

    return json(
      {
        antragnr: result.antragnr,
        complete: true,
        currentStatus: result.status,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Error while processing AntragDetails", error);
    return new Response("Error processing requests", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
