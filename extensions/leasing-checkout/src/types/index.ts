export type CalcData = {
  objektVersicherungVorhanden: string;
  finanzierungsbetragNetto: string;
  anzahlung: string;
  zahlungsweise: string;
  zahlungsweiseLabel: string;
};

export type Steps = 0 | 1 | 2;

export type ManagerFormData = {
  anrede: string;
  geburtsdatum: string;
  nachname: string;
  ortGF: string;
  plzGF: string;
  strasseGF: string;
  telGF: string;
  vorname: string;
};

export type FirmaFormData = {
  bank: string;
  email: string;
  firmenname: string;
  ort: string;
  plz: string;
  rechtsform: string;
  strasse: string;
  telefon: string;
};
