import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { scheduleCleanUp } from "~/cleanJobs";
import { createDbShopifyOrder } from "~/models/shopifyOrder.server";
import {
  createDraftOrder,
  type DraftOrderInput,
} from "~/shopify/graphql/createDraftOrder";
import { getCurrentFormattedTime } from "~/utils/helpers";

type DraftOrderResponse = {
  draftOrderCreate: {
    draftOrder: {
      id: string;
      name: string;
    };
  };
};

type CreateDraftOrderProps = {
  shop: string;
  albisDraftOrderData: DraftOrderInput;
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const { shop, albisDraftOrderData }: CreateDraftOrderProps = data;

  const draftOrderResponse = await createDraftOrder(shop, {
    ...albisDraftOrderData,
    note: `Albis Leasing Request created at: ${getCurrentFormattedTime()}`,
  });
  const { data: draftOrderData }: { data?: DraftOrderResponse } =
    draftOrderResponse;

  if (!draftOrderResponse || !draftOrderData) {
    return json(draftOrderResponse, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const draftOrderReturn = {
    draftOrder: {
      id: draftOrderData.draftOrderCreate.draftOrder.id,
      name: draftOrderData.draftOrderCreate.draftOrder.name,
    },
  };
  const { id, name } = draftOrderReturn.draftOrder;

  await createDbShopifyOrder(shop, {
    draftOrderId: id,
    draftOrderName: name,
  });

  scheduleCleanUp(id);

  return json(draftOrderReturn, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};
