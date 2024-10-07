import type { Werte } from "../types/albisMethods";
import { baseServerUrl } from "./urls";

type Geschaeftsfuehrer = {
  anrede: string;
  vorname: string;
  nachname: string;
  strasse: string;
  plz: string;
  ort: string;
  gebdat: string;
  telnr: string;
};

type Leasingnehmer = {
  name: string;
  strasse: string;
  plz: string;
  ort: string;
  rechtsform: string;
  telefon: string;
  email: string;
  geschaeftsfuehrer: Geschaeftsfuehrer;
};

export type Antragsdaten = {
  objekt: string;
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
};

export const getAlbisMethodsData = async (
  shop: string,
  method: string,
  werte?: Werte,
  antragsdaten?: Antragsdaten,
  antragnr?: number,
) => {
  try {
    const body = JSON.stringify({
      method,
      shop,
      werte,
      antragsdaten,
      antragnr,
    });
    const response = await fetch(`${baseServerUrl}/api/getMethodsData`, {
      method: "POST",
      body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AppConfig:", error);
  }
};
