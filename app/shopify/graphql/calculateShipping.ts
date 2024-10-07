import { getGraphqlClient } from "./getGraphqlClient";

interface Address {
  address1: string;
  city: string;
  zip: string;
  countryCode: string;
}

interface LineItem {
  variantId: string;
  quantity: number;
}

export interface DraftOrderInputShipping {
  shop: string;
  shippingAddress?: Address;
  lineItems: LineItem[];
}

export async function draftOrderCalculate(input: DraftOrderInputShipping) {
  const graphQlClient = await getGraphqlClient(input.shop);

  const response = await graphQlClient.request(
    `mutation draftOrderCalculate($input: DraftOrderInput!) {
      draftOrderCalculate(input: $input) {
        calculatedDraftOrder {
          availableShippingRates {
              price {
                  amount
                    }
          }
        }
      }
    }`,
    {
      variables: {
        input: {
          shippingAddress: {
            address1: input.shippingAddress?.address1,
            city: input.shippingAddress?.city,
            zip: input.shippingAddress?.zip,
            countryCode: "DE",
          },
          lineItems: input.lineItems,
        },
      },
    },
  );
  return response;
}
