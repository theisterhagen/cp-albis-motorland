import type {
  ModulAktiv,
  ModulEinstellungen,
  ModulZugangsdaten,
  ShopifyOrders,
} from "@prisma/client";
import type {
  ResultProduktgruppen,
  ResultVertragsarten,
  ResultZahlungsweisen,
} from "./methods";

export type ModulAktivData = Omit<ModulAktiv, "id">;

export type ModulZugangsdatenData = Omit<
  ModulZugangsdaten,
  "id" | "modulAktivId"
>;
export type ModulZugangsdatenCredentials = Omit<
  ModulZugangsdatenData,
  "isCredentialsValid"
>;

export type ModulEinstellungenData = Omit<
  ModulEinstellungen,
  "id" | "zugangsdatenId"
>;

// export type ModulZugangsdatenPlugin = {
//   isCredentialsValid: boolean;
// } & ModulZugangsdatenData;

export type PluginConfData = {
  modulAktiv: ModulAktivData;
  modulZugangsdaten: ModulZugangsdatenData;
  modulEinstellungen: ModulEinstellungenData;
  methodsData?: {
    zahlungsweisen: ResultZahlungsweisen[];
    produktgruppen: ResultProduktgruppen[];
    vertragsarten: ResultVertragsarten[];
  };
};

export type ActionZugangsdaten = {
  error?: string;
};

export type ShopifyOrdersData = Omit<ShopifyOrders, "isCredentialsValid">;
