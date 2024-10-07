import { getGraphqlClient } from "./getGraphqlClient";

export async function cancelOrder(
  shop: string,
  orderId: string,
  options: {
    notifyCustomer: boolean;
    reason: "CUSTOMER" | "DECLINED" | "FRAUD" | "INVETORY" | "OTHER" | "STAFF";
    refund: boolean;
    restock: boolean;
  },
) {
  const graphQlClient = await getGraphqlClient(shop);

  const response = await graphQlClient.request(
    `#graphql
    mutation OrderCancel($orderId: ID!, $notifyCustomer: Boolean, $refund: Boolean!, $restock: Boolean!, $reason: OrderCancelReason!) {
      orderCancel(orderId: $orderId, notifyCustomer: $notifyCustomer, refund: $refund, restock: $restock, reason: $reason) {
        job {
          id
          done
        }
        orderCancelUserErrors {
          field
          message
          code
        }
      }
    }`,
    {
      variables: {
        orderId,
        notifyCustomer: options.notifyCustomer,
        refund: options.refund,
        restock: options.restock,
        reason: options.reason,
      },
    },
  );

  return response;
}
