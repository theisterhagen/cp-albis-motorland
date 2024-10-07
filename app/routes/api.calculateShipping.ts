import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { DraftOrderInputShipping } from "~/shopify/graphql/calculateShipping";
import { draftOrderCalculate } from "~/shopify/graphql/calculateShipping";

export const action: ActionFunction = async ({ request }) => {
  const data: DraftOrderInputShipping = await request.json();
  try {
    const calculateShippingResponse = await draftOrderCalculate(data);
    if (!calculateShippingResponse) {
      return json(calculateShippingResponse, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    return json(calculateShippingResponse, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
