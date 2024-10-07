import type { DraftOrderInput, LineItem } from "../types/draftOrder";

type createDraftOrderObjProps = {
  email: string;
  phone: string;
  address: {
    address1: string;
    city: string;
    zip: string;
    lastName: string;
  };
  lineItems: LineItem[];
};

export const createDraftOrderObj = (props: createDraftOrderObjProps) => {
  const { address, email, lineItems, phone } = props;
  const { address1, city, lastName, zip } = address;
  const draftOrderInput: DraftOrderInput = {
    // note: `Albis Leasing Request created at: ${getCurrentFormattedTime()}`,
    email: email,
    phone: /^(\+?\d{1,3})?0?\d{9,13}$/.test(phone) ? `+49${phone}` : "",
    tags: "Albis Leasing",
    billingAddress: {
      address1: address1 ?? "",
      city: city ?? "",
      zip: zip ?? "",
      countryCode: "DE",
      lastName: lastName ?? "",
    },
    shippingAddress: {
      address1: address1 ?? "",
      city: city ?? "",
      zip: zip ?? "",
      countryCode: "DE",
      lastName: lastName ?? "",
    },
    customAttributes: [
      {
        key: "Commerce-Pro",
        value: "Albis-Leasing",
      },
    ],
    lineItems,
  };

  return draftOrderInput;
};
