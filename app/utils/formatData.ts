import type {
  JsonRpcErrorResponse,
  ResultProduktgruppen,
  ResultVertragsarten,
  ResultZahlungsweisen,
} from "../types/methods";

type FormatData = {
  [k: string]: FormDataEntryValue;
};

export const formatData = (
  values: FormatData,
  hasBoolean: boolean = false,
): {
  [key: string]: string | boolean;
} => {
  const booleanKeys = [
    "restwertInBeiTAVertrag",
    "auswahlZahlungsweiseAnzeigen",
    "objektVersicherung",
    "auswahlObjektVersicherungAnzeigen",
    "eingabeSonderzahlungErmoglichen",
    "pInfoseiteZeigeAlle",
    "antragOhneArtikelMoglich",
    "kundeKannFinanzierungsbetragAndern",
  ];
  const castedValues = Object.entries(values).reduce(
    (acc, [key, value]) => {
      if (hasBoolean && booleanKeys.includes(key)) {
        acc[key] = value.toString() === "true";
      } else {
        acc[key] = value.toString();
      }
      return acc;
    },
    {} as { [key: string]: string | boolean },
  );
  return castedValues;
};

export type OptionsMethodData = Array<{
  id: string;
  labelValue: string;
  selected?: boolean;
}>;

export const getOptionsMethodData = (
  methodData:
    | ResultZahlungsweisen[]
    | ResultProduktgruppen[]
    | ResultVertragsarten[],
  bdSelectedOpt?: string,
): OptionsMethodData => {
  const optionsMethodData = methodData.map((item) => ({
    id: item.id.toString(),
    labelValue: item.bezeichnung,
    selected: !!bdSelectedOpt && item.id.toString() === bdSelectedOpt,
  }));
  return optionsMethodData;
};

export function isJsonRpcErrorResponse(
  object: any,
): object is JsonRpcErrorResponse {
  return "error" in object;
}

export function appendUniqueNote(
  existingNotes: string,
  newNote: string,
): string {
  if (!existingNotes) return newNote;
  if (!existingNotes.includes(newNote)) return `${existingNotes}\n${newNote}`;
  return existingNotes;
}

export const extractNumberFromUrl = (url: string) => {
  const match = url.match(/\d+/);
  // console.log("match", match);
  return match ? match[0] : "";
};
