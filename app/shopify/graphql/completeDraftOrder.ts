import { getGraphqlClient } from "./getGraphqlClient";

export async function completeDraftOrder(shop: string, draftOrderId: string) {
  const graphQlClient = await getGraphqlClient(shop);

  console.log("completeDraftOrder", shop, draftOrderId);

  const response = await graphQlClient.request(
    `#graphql
    mutation draftOrderComplete($id: ID!) {
      # draftOrderComplete(id: $id, paymentPending: $paymentPending) {
      draftOrderComplete(id: $id) {
        draftOrder {
          id,
          order {
            id,
            name
          }
        }
      }
    }`,
    {
      variables: {
        id: draftOrderId,
        // paymentPending: true,
      },
    },
  );
  return response;
}
