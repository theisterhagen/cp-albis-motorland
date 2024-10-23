import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
// import { scheduleAntragCheck } from "~/cronJobs";
import { scheduleCleanUp } from "~/cleanJobs";
import {
  getAntragDetails,
  updateAntragDetails,
} from "~/models/antragDetails.server";
import {
  getDbShopifyOrders,
  updateConnectionDbShopifyOrdersUndAntrag,
} from "~/models/shopifyOrder.server";
import { addNoteToOrder } from "~/shopify/graphql/addNoteToOrder";
import { completeDraftOrder } from "~/shopify/graphql/completeDraftOrder";
import { deleteDraftOrder } from "~/shopify/graphql/deleteDraftOrder";
import type { CompleteDraftOrderResponse } from "~/types/routesInterfaces";
import { isJsonRpcErrorResponse } from "~/utils/formatData";
import { getAlbisMethodsData } from "~/utils/getAlbisMethodsData";
import { checkAntragStatus, getCurrentFormattedTime } from "~/utils/helpers";
import type { GetAntragDetails, JsonRpcErrorResponse } from "../types/methods";

type CheckAntrageDetailsBody = {
  shop: string;
  antragnr: number;
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const { shop, antragnr }: CheckAntrageDetailsBody = data;
  console.log("shop, antragnr", shop, antragnr);
  try {
    const shopifyOrders = await getDbShopifyOrders({
      antragnr,
    });
    const currentAntragnr = await getAntragDetails(antragnr);

    if (!shopifyOrders || !shopifyOrders?.orderId || !currentAntragnr) {
      return new Response("Error processing shopify Orders Data", {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const newAntragDetails: GetAntragDetails | JsonRpcErrorResponse =
      await getAlbisMethodsData({
        method: "getAntragDetails",
        shop,
        antragnr,
      });

    if (isJsonRpcErrorResponse(newAntragDetails)) {
      console.error("RPC Error AntragDetails:", newAntragDetails);
      return json(newAntragDetails, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const { result } = newAntragDetails;
    const statusData = checkAntragStatus(result.status, result.status_txt);
    const checkDates = currentAntragnr.lastCheckAt
      ? JSON.parse(currentAntragnr.lastCheckAt)
      : "";
    const newLastCheckAt = [...checkDates, getCurrentFormattedTime()];
    if (!statusData.isStatusFinish) {
      await updateAntragDetails({
        antragnr: result.antragnr,
        lastCheckAt: JSON.stringify(newLastCheckAt),
      });
      // await addNoteToOrder(shop, shopifyOrders.orderId, statusData.statusNote);
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
        await deleteDraftOrder(shop, shopifyOrders.draftOrderId);
        const scheduledTaskCancel = scheduleCleanUp(shopifyOrders.draftOrderId);
        scheduledTaskCancel.cancel();
        break;
      case "Paid":
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

        const updatedShopifyOrderData =
          await updateConnectionDbShopifyOrdersUndAntrag(
            shopifyOrders.draftOrderId,
            shopifyOrders.antragnr ?? 0,
            {
              id: orderId ?? "",
              name: orderName ?? "",
            },
          );

        await addNoteToOrder(
          shop,
          updatedShopifyOrderData?.orderId ?? "",
          statusData.statusNote,
        );
        break;
      case "Refund":
        await deleteDraftOrder(shop, shopifyOrders.draftOrderId);
        const scheduledTaskDelete = scheduleCleanUp(shopifyOrders.draftOrderId);
        scheduledTaskDelete.cancel();
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
