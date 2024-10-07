import { getGraphqlClient } from "./getGraphqlClient";

interface Address {
  address1: string;
  city: string;
  zip: string;
  countryCode: string;
  firstName?: string;
  lastName: string;
}

interface ShippingLine {
  title: string;
  price: number;
}

interface CustomAttribute {
  key: string;
  value: string;
}

interface LineItem {
  variantId: string;
  quantity: number;
}

export interface DraftOrderInput {
  customerId?: string;
  note?: string;
  email: string;
  phone?: string;
  taxExempt?: boolean;
  tags?: string;
  visibleToCustomer?: boolean;
  shippingLine?: ShippingLine;
  shippingAddress?: Address;
  billingAddress: Address;
  customAttributes: CustomAttribute[];
  lineItems: LineItem[];
}

export async function createDraftOrder(shop: string, input: DraftOrderInput) {
  const graphQlClient = await getGraphqlClient(shop);

  const response = await graphQlClient.request(
    `mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id,
          name
        }
      }
    }`,
    {
      variables: {
        input: {
          note: input.note,
          email: input.email,
          tags: "Albis Leasing",
          visibleToCustomer: true,
          shippingAddress: {
            address1: input.shippingAddress?.address1,
            city: input.shippingAddress?.city,
            zip: input.shippingAddress?.zip,
            countryCode: "DE",
          },
          billingAddress: {
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
