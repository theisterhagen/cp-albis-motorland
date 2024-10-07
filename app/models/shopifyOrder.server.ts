import type { AntragDetails, ShopifyOrders } from "@prisma/client";
import type { ShopifyOrdersData } from "~/types/pluginConfigurator";
import db from "../db.server";

export async function createDbShopifyOrder(
  shop: string,
  ordersInfo: Pick<ShopifyOrders, "draftOrderId" | "draftOrderName">,
) {
  try {
    const dbShopifyOrdersData = await db.shopifyOrders.create({
      data: {
        shop,
        draftOrderId: ordersInfo.draftOrderId,
        draftOrderName: ordersInfo.draftOrderName,
      },
    });
    return dbShopifyOrdersData;
  } catch (error) {
    console.error("create dbShopifyOrders failed", error);
    return null;
  }
}

type GetDbShopifyOrdersProps = {
  antragnr?: AntragDetails["antragnr"];
  draftOrderId?: string;
};

export async function getDbShopifyOrders({
  antragnr,
  draftOrderId,
}: GetDbShopifyOrdersProps): Promise<ShopifyOrders | null> {
  try {
    if (antragnr) {
      const dbShopifyOrdersData = await db.shopifyOrders.findUnique({
        where: { antragnr },
      });
      return dbShopifyOrdersData;
    }
    if (draftOrderId) {
      const dbShopifyOrdersData = await db.shopifyOrders.findUnique({
        where: { draftOrderId },
      });
      return dbShopifyOrdersData;
    }
    return null;
  } catch (error) {
    console.error("Failed to retrieve ShopifyOrder", error);
    return null;
  }
}

export async function updateDbShopifyOrders(
  draftOrderId: string,
  updatedData: Partial<ShopifyOrdersData>,
) {
  try {
    const shopifyOrdersData = await db.shopifyOrders.update({
      where: { draftOrderId },
      data: { ...updatedData },
    });
    return shopifyOrdersData;
  } catch (error) {
    console.error("Get Shopify Order failed", error);
    return null;
  }
}

export async function updateConnectionDbShopifyOrdersUndAntrag(
  draftOrderId: string,
  antragnr: AntragDetails["antragnr"],
  orderData?: {
    id: string;
    name: string;
  },
) {
  try {
    if (!antragnr) return;

    const shopifyOrdersData = await db.shopifyOrders.update({
      where: { draftOrderId },
      data: {
        orderId: orderData?.id,
        orderName: orderData?.name,
        antragDetails: {
          connect: { antragnr },
        },
      },
    });

    return shopifyOrdersData;
  } catch (error) {
    console.error("Updating Shopify Order failed", error);
    return null;
  }
}

export async function deleteShopifyOrdersData(draftOrderId: string) {
  try {
    const shopifyOrderData = await db.shopifyOrders.delete({
      where: { draftOrderId },
    });
    return shopifyOrderData;
  } catch (error) {
    console.error("Delete Shopify Order failed", error);
    return null;
  }
}
