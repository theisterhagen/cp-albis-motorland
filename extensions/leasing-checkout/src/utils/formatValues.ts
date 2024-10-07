import type { JsonRpcErrorResponse } from "../types/albisMethods";

export const formatToNetValue = (value: number | string) => {
  return `${(Number(value) / 1.19).toFixed(2)}`;
};

export const formatToEuro = (value: number | string) => {
  const formatter = new Intl.NumberFormat("de-DE", {
    // style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const onlyNumbers = onlyNumericDigits(value);
  const formattedValue = formatter.format(Number(onlyNumbers) / 100);

  return formattedValue;
};

export function formatDecimalNumber(value: number | string) {
  const onlyNumbers = onlyNumericDigits(value);
  return (Number(onlyNumbers) / 100).toFixed(2);
}

export const calculateNettoPlusShipping = (
  netto: string | number,
  shippingPrice?: string | number,
) => {
  return `${Number(netto) + Number(shippingPrice ?? 0) * 100}`.replace(
    /\D/g,
    "",
  );
};

export function isJsonRpcErrorResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
): object is JsonRpcErrorResponse {
  return "error" in object;
}

export const onlyNumericDigits = (value: number | string): string => {
  return `${value}`.replace(/[^\d]/g, "");
};

export const formatDateToLeasing = (dateString: string) => {
  const digitsOnly = dateString.replace(/\D/g, "").trim();

  if (digitsOnly.length !== 8) {
    return "Invalid input, must contain exactly 8 digits.";
  }

  const day = digitsOnly.substring(0, 2);
  const month = digitsOnly.substring(2, 4);
  const year = digitsOnly.substring(4, 8);

  return `${year}-${day}-${month}`;
};
