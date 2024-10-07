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

export interface LineItem {
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
