import type { LeasingData } from "../context/leasingCtx";
import type { CalcData, FirmaFormData, ManagerFormData } from "../types";

export const initialFirmaFormData: FirmaFormData = {
  rechtsform: "1",
  firmenname: "",
  strasse: "",
  plz: "",
  ort: "",
  telefon: "",
  email: "",
  bank: "",
};

export const initialManagerFormData: ManagerFormData = {
  anrede: "1",
  vorname: "",
  nachname: "",
  strasseGF: "",
  plzGF: "",
  ortGF: "",
  telGF: "",
  geburtsdatum: "",
};

export const initialCalcFormData: CalcData = {
  finanzierungsbetragNetto: "",
  zahlungsweise: "",
  objektVersicherungVorhanden: "",
  anzahlung: "",
  zahlungsweiseLabel: "",
};

export const initialLeasingData: LeasingData = {
  leasingRate: null,
  selectedRateOpt: null,
};
