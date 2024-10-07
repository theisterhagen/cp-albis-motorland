import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  getAlbisMethodsData,
  type GetMethodsDataRequest,
} from "~/utils/getAlbisMethodsData";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const {
    method,
    credentials,
    werte,
    shop,
    antragsdaten,
    antragnr,
  }: GetMethodsDataRequest = data;
  try {
    const methodsData = await getAlbisMethodsData({
      method,
      credentials,
      werte,
      shop,
      antragsdaten,
      antragnr,
    });

    return json(methodsData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return new Response(error.message || "An error occurred", {
      status: error.statusCode || 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
};
