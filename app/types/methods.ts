interface RpcError {
  code: number;
  message: string;
  data: unknown;
}

export interface JsonRpcErrorResponse {
  id: number;
  jsonrpc: string;
  error: RpcError;
}

export interface ResultVertragsarten {
  id: number;
  bezeichnung: string;
  kuerzel: string;
  pos: number;
}

export interface ResultProduktgruppen {
  id: number;
  bezeichnung: string;
  lz_min: number;
  lz_max: number;
  lz_min_albis: number;
  lz_max_albis: number;
  kuendmonat: number;
  pos: number;
}

export interface ResultZahlungsweisen {
  id: number;
  bezeichnung: string;
  monate: number;
}

export interface GetVertragsarten {
  id: number;
  jsonrpc: string;
  result: ResultVertragsarten[];
}

export interface GetProduktgruppen {
  id: number;
  jsonrpc: string;
  result: ResultProduktgruppen[];
}

export interface GetZahlungsweisen {
  id: number;
  jsonrpc: string;
  result: ResultZahlungsweisen[];
}

export interface GetStelleAntrag {
  id: number;
  jsonrpc: string;
  result: number;
}

export interface StelleAntrag {
  antragsdaten: Antragsdaten;
}

export interface Antragsdaten {
  objekt?: string;
  kaufpreis: string;
  mietsz: string;
  laufzeit: string;
  rate: string;
  leasingnehmer: Leasingnehmer;
  provision: string;
  ssv: string;
  prodgrp: string;
  vertragsart: string;
  zahlweise: string;
  iban: string;
  service_pauschale: number;
  vertrag_an_ln: boolean;
}

export interface Leasingnehmer {
  name: string;
  strasse: string;
  plz: string;
  ort: string;
  rechtsform: string;
  telefon: string;
  faxnr: string;
  email: string;
  geschaeftsfuehrer: Geschaeftsfuehrer;
}

export interface Geschaeftsfuehrer {
  anrede: number;
  vorname: string;
  nachname: string;
  strasse: string;
  plz: string;
  ort: string;
  gebdat: string; // Date in YYYY-MM-DD format
  telnr: string;
  faxnr: string;
}

export interface GetAntragDetailsResult {
  antragnr: number;
  objekt: string;
  kaufpreis: number;
  mietsz: number;
  laufzeit: number;
  rate: number;
  mail_an_ln: boolean;
  ln_name: string;
  ln_strasse: string;
  ln_plz: string;
  ln_ort: string;
  ln_telefon: string;
  ln_mobil: string | null;
  ln_fax: string | null;
  ln_email: string;
  gf_name: string;
  gf_vname: string;
  gf_nname: string;
  gf_anrede_text: string;
  gf_anrede: number;
  gf_strasse: string;
  gf_plz: string;
  gf_ort: string;
  gf_gebdat: string;
  eingegangen: string;
  promotion_id: number | null;
  status: number;
  status_txt: string;
  ln_rechtsform: number;
  iban: string;
  bic: string;
  prodgrp: number;
  ssv: boolean;
  schlusszahlung: number;
  vertragsart: number;
  zahlweise: number;
  provproz: number;
  ta_rw_proz: number | null;
  referenz: string | null;
  restwert: number;
  kuendbar_auf: number;
  saleleaseback: boolean;
  vk_id: number;
  vertrag_an_ln: boolean;
  bankname: string;
  entsch_dok: any[];
  vertr_dok: any[];
}

export interface GetAntragDetails {
  id: number;
  jsonrpc: string;
  result: GetAntragDetailsResult;
}

export type Method =
  | "getZahlungsweisen"
  | "getProduktgruppen"
  | "getVertragsarten"
  | "getRechtsformen"
  | "stelleAntrag"
  | "getAntragDetails"
  | "getVertrag";
