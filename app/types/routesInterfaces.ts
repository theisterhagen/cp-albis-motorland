export type DraftOrder = {
  id: string;
  name: string;
};

export type DraftOrderResponse = {
  draftOrderCreate: {
    draftOrder: DraftOrder;
  };
};

export type CompleteDraftOrderResponse = {
  draftOrderComplete: {
    draftOrder: {
      id: string;
      order: {
        id: string;
        name: string;
      };
    };
  };
};

export type CompleteDraftOrderProps = {
  draftOrder: DraftOrder;
};
