export type ModulEinstellungen = {
  vertragsart: string;
  restwertInBeiTAVertrag: boolean;
  produktgruppe: string;
  produktgruppeLabel: string;
  zahlungsweisen: string;
  auswahlZahlungsweiseAnzeigen: boolean;
  minLeasingsumme: string;
  servicePauschaleNetto: string;
  albisServiceGebuhrNetto: string;
  provisionsangabe: string;
  objektVersicherung: boolean;
  auswahlObjektVersicherungAnzeigen: boolean;
  mietsonderzahlung: string;
  eingabeSonderzahlungErmoglichen: boolean;
  pInfoseiteZeigeAlle: boolean;
  antragOhneArtikelMoglich: boolean;
  kundeKannFinanzierungsbetragAndern: boolean;
};
export type ModulAktiv = { isModulAktiv: boolean };
export type ModulZugangsdaten = { isCredentialsValid: boolean | null };
export type PluginConfig = {
  modulAktiv: ModulAktiv;
  modulZugangsdaten: ModulZugangsdaten;
  modulEinstellungen: ModulEinstellungen;
};
