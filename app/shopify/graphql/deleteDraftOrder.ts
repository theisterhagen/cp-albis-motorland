import { getGraphqlClient } from "./getGraphqlClient";

export async function deleteDraftOrder(shop: string, draftOrderId: string) {
  const graphQlClient = await getGraphqlClient(shop);

  const response = await graphQlClient.request(
    `#graphql
    mutation draftOrderDelete($input: DraftOrderDeleteInput!) {
    draftOrderDelete(input: $input) {
      deletedId
    }
  }`,
    {
      variables: {
        input: {
          id: draftOrderId,
        },
      },
    },
  );
  return response;
}
