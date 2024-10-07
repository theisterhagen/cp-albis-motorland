import type { CalcData, FirmaFormData, ManagerFormData } from "../types";
import type { Rate, StelleAntrag } from "../types/albisMethods";
import type { PluginConfig } from "../types/pluginConfig";
import { formatDateToLeasing, formatDecimalNumber } from "./formatValues";

type CreateAntragsDatenObjProps = {
  objekt: string;
  calcData: CalcData;
  leasingRate: Rate;
  firmaFormData: FirmaFormData;
  managerFormData: ManagerFormData;
  modulEinstellungen: PluginConfig["modulEinstellungen"];
  datenschutz: boolean;
};

export const createAntragsDatenObj = ({
  objekt,
  calcData,
  leasingRate,
  firmaFormData,
  managerFormData,
  modulEinstellungen,
  datenschutz,
}: CreateAntragsDatenObjProps): StelleAntrag => {
  return {
    objekt,
    kaufpreis: formatDecimalNumber(
      calcData.finanzierungsbetragNetto.replace(/\D/g, ""),
    ),
    mietsz: calcData.anzahlung,
    laufzeit: leasingRate.laufzeit.toString(),
    rate: leasingRate.rate.toString(),
    leasingnehmer: {
      name: firmaFormData.firmenname,
      strasse: firmaFormData.strasse,
      plz: firmaFormData.plz,
      ort: firmaFormData.ort,
      rechtsform: firmaFormData.rechtsform,
      telefon: firmaFormData.telefon,
      email: firmaFormData.email,
      geschaeftsfuehrer: {
        anrede: managerFormData.anrede,
        vorname: managerFormData.vorname,
        nachname: managerFormData.nachname,
        strasse: managerFormData.strasseGF,
        plz: managerFormData.plzGF,
        ort: managerFormData.ortGF,
        gebdat: formatDateToLeasing(managerFormData.geburtsdatum),
        telnr: managerFormData.telGF,
      },
    },
    provision: modulEinstellungen.provisionsangabe,
    ssv: calcData.objektVersicherungVorhanden,
    prodgrp: modulEinstellungen.produktgruppe,
    vertragsart: modulEinstellungen.vertragsart,
    zahlweise: calcData.zahlungsweise,
    iban: firmaFormData.bank,
    service_pauschale: Number(modulEinstellungen.servicePauschaleNetto),
    vertrag_an_ln: datenschutz,
  };
};
