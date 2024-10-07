import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  // deleteShopifyOrdersData,
  getDbShopifyOrders,
} from "~/models/shopifyOrder.server";
import { deleteDraftOrder } from "~/shopify/graphql/deleteDraftOrder";
import { scheduleCleanUp } from "../cleanJobs";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const { albisOrderId } = data;

  if (!data) {
    console.log(`clean up - !data ${data}`);
    return json(`albisOrderId not found ${albisOrderId}`, {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const currentShopifyData = await getDbShopifyOrders({
    draftOrderId: albisOrderId,
  });

  if (!currentShopifyData) {
    console.log(`clean up - currentOrderData not found ${albisOrderId}`);
    return json(`currentShopifyData not found ${albisOrderId}`, {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  if (currentShopifyData.orderId) {
    // Cancel the scheduled job for the consorsOrderId
    const scheduledTask = scheduleCleanUp(currentShopifyData.draftOrderId);
    if (scheduledTask) {
      scheduledTask.cancel();
      return json(
        {
          message: `Scheduled task for albisLeasing ${currentShopifyData.draftOrderId} has been canceled.`,
        },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }
  }

  if (!currentShopifyData.orderId) {
    await deleteDraftOrder(
      currentShopifyData.shop ?? "",
      currentShopifyData.draftOrderId,
    );
    // await deleteShopifyOrdersData(currentShopifyData.draftOrderId);

    return json(
      { message: "draft order deleted" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
};
