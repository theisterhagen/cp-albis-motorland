import type { GetAntragDetails } from "./albisMethods";

export interface DraftOrderCalculate {
  data: {
    draftOrderCalculate: {
      calculatedDraftOrder: {
        availableShippingRates: {
          price: {
            amount: string;
          };
        }[];
      };
    };
  };
  extensions: {
    cost: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

export interface CustomAttribute {
  key: string;
  value: string;
}

// export type DraftOrderResponse = {
//   consorsOrderId: string;
// };

export type CreateLeasingApplication = {
  getAntragDetails: GetAntragDetails;
  // orderId: string;
  // draftOrder: AlbisDraftOrderResponse;
};

export type AlbisDraftOrderResponse = {
  draftOrder: {
    id: string;
    name: string;
  };
};
