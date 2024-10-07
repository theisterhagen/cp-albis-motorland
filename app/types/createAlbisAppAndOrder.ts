import type { Antragsdaten } from "./methods";

interface LineItem {
  variantId: string;
  quantity: number;
}

export interface CreateAlbisAppAndOrder {
  shop: string;
  antragsdaten: Antragsdaten;
  lineItems: LineItem[];
  draftOrder: {
    id: string;
    name: string;
  };
}
