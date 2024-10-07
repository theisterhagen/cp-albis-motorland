import type { JsonRpcErrorResponse, StelleAntrag } from "../types/albisMethods";
import type {
  AlbisDraftOrderResponse,
  CreateLeasingApplication,
} from "../types/shopifyResponse";
import { baseServerUrl } from "./urls";

export interface LineItem {
  variantId: string;
  quantity: number;
}

export const createAlbisApplication = async (
  shop: string,
  antragsdaten: StelleAntrag,
  draftOrder: AlbisDraftOrderResponse["draftOrder"],
) => {
  try {
    const body = JSON.stringify({
      shop,
      antragsdaten,
      draftOrder,
    });
    const response = await fetch(
      `${baseServerUrl}/api/createAlbisApplication`,
      {
        method: "POST",
        body,
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: CreateLeasingApplication | JsonRpcErrorResponse | undefined =
      await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AppConfig:", error);
  }
};
