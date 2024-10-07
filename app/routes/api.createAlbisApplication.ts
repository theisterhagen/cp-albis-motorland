import type { AntragDetails } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { scheduleAntragCheck } from "~/cronJobs";
import { createAntragDetails } from "~/models/antragDetails.server";
import { updateConnectionDbShopifyOrdersUndAntrag } from "~/models/shopifyOrder.server";
import type { AntragDetailsData } from "~/models/types";
import { isJsonRpcErrorResponse } from "~/utils/formatData";
import { getAlbisMethodsData } from "~/utils/getAlbisMethodsData";
import { getCurrentFormattedTime } from "~/utils/helpers";
import type {
  Antragsdaten,
  GetAntragDetails,
  GetStelleAntrag,
  JsonRpcErrorResponse,
} from "../types/methods";

export interface CreateAlbisApplicationProps {
  shop: string;
  antragsdaten: Antragsdaten;
  draftOrder: {
    id: string;
    name: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const { shop, antragsdaten, draftOrder }: CreateAlbisApplicationProps = data;
  console.log("application data", data);

  const getStelleAntragData: GetStelleAntrag | JsonRpcErrorResponse =
    await getAlbisMethodsData({
      method: "stelleAntrag",
      shop,
      antragsdaten: {
        ...antragsdaten,
        objekt: draftOrder.name,
      },
    });

  console.log("getStelleAntragData", getStelleAntragData);
  if (isJsonRpcErrorResponse(getStelleAntragData)) {
    console.error("RPC Error:", getStelleAntragData);
    return json(
      {
        ...getStelleAntragData,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
  const newAntragDetails: GetAntragDetails | JsonRpcErrorResponse =
    await getAlbisMethodsData({
      method: "getAntragDetails",
      shop,
      antragnr: getStelleAntragData.result,
    });
  console.log("newAntragDetails", newAntragDetails);

  if (isJsonRpcErrorResponse(newAntragDetails)) {
    console.log("RPC Error AntragDetails:", newAntragDetails);
    return json(newAntragDetails, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const { result } = newAntragDetails;

  const antragnrDetails: AntragDetailsData = {
    antragnr: result.antragnr,
    kaufpreis: result.kaufpreis,
    status: result.status,
    status_txt: result.status_txt,
    complete: false,
    eingegangen: result.eingegangen,
    ln_name: result.ln_name,
    ln_telefon: result.ln_telefon,
    ln_mobil: result.ln_mobil,
    ln_email: result.ln_email,
    gf_name: result.gf_name,
    gf_vname: result.gf_vname,
    lastCheckAt: JSON.stringify([getCurrentFormattedTime()]),
  };
  const antragnrData: AntragDetails | null =
    await createAntragDetails(antragnrDetails);

  if (!antragnrData) {
    return new Response("Error ao Criar Antragnr", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const updatedDb = await updateConnectionDbShopifyOrdersUndAntrag(
    draftOrder.id,
    antragnrDetails.antragnr,
  );
  console.log("updatedDb", updatedDb);

  scheduleAntragCheck(updatedDb?.antragnr, shop);

  return json(
    {
      getAntragDetails: newAntragDetails,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
};
