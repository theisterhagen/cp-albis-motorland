import type { DraftOrderInput } from "../types/draftOrder";
import type { AlbisDraftOrderResponse } from "../types/shopifyResponse";
import { baseServerUrl } from "./urls";

export interface LineItem {
  variantId: string;
  quantity: number;
}

export type CreateAlbisDraftOrderProps = {
  shop: string;
  albisDraftOrderData: DraftOrderInput;
};

export const createAlbisDraftOrder = async ({
  shop,
  albisDraftOrderData,
}: CreateAlbisDraftOrderProps) => {
  try {
    const body = JSON.stringify({
      shop,
      albisDraftOrderData,
    });
    const response = await fetch(`${baseServerUrl}/api/createDraftOrder`, {
      method: "POST",
      body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: AlbisDraftOrderResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AppConfig:", error);
  }
};
