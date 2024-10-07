import type {
  ResultProduktgruppen,
  ResultVertragsarten,
  ResultZahlungsweisen,
} from "../types/methods";
import type {
  ModulAktivData,
  ModulEinstellungenData,
  ModulZugangsdatenData,
  PluginConfData,
} from "../types/pluginConfigurator";

type GetLoaderResponse = {
  modulAktiv?: ModulAktivData;
  modulZugangsdaten?: ModulZugangsdatenData;
  modulEinstellungen?: ModulEinstellungenData;
  isCredentialsValid?: boolean;
  methodsData?: {
    zahlungsweisen: ResultZahlungsweisen[];
    produktgruppen: ResultProduktgruppen[];
    vertragsarten: ResultVertragsarten[];
  };
};

export const getLoaderResponse = ({
  modulAktiv,
  modulZugangsdaten,
  modulEinstellungen,
  isCredentialsValid,
  methodsData,
}: GetLoaderResponse) => {
  const loaderReturn: PluginConfData = {
    modulAktiv: {
      isModulAktiv: modulAktiv?.isModulAktiv ?? false,
      shop: modulAktiv?.shop ?? "",
    },
    modulZugangsdaten: {
      isCredentialsValid: isCredentialsValid ?? false,
      apiLink: modulZugangsdaten?.apiLink ?? "",
      benutzer: modulZugangsdaten?.benutzer ?? "",
      passwort: modulZugangsdaten?.passwort ?? "",
    },
    modulEinstellungen: {
      vertragsart: modulEinstellungen?.vertragsart ?? "",
      restwertInBeiTAVertrag:
        modulEinstellungen?.restwertInBeiTAVertrag ?? null,
      produktgruppe: modulEinstellungen?.produktgruppe ?? "",
      produktgruppeLabel: modulEinstellungen?.produktgruppeLabel ?? "",
      zahlungsweisen: modulEinstellungen?.zahlungsweisen ?? "",
      auswahlZahlungsweiseAnzeigen:
        modulEinstellungen?.auswahlZahlungsweiseAnzeigen ?? false,
      minLeasingsumme: modulEinstellungen?.minLeasingsumme ?? "",
      servicePauschaleNetto: modulEinstellungen?.servicePauschaleNetto ?? "",
      albisServiceGebuhrNetto:
        modulEinstellungen?.albisServiceGebuhrNetto ?? "",
      provisionsangabe: modulEinstellungen?.provisionsangabe ?? "",
      objektVersicherung: modulEinstellungen?.objektVersicherung ?? false,
      auswahlObjektVersicherungAnzeigen:
        modulEinstellungen?.auswahlObjektVersicherungAnzeigen ?? false,
      mietsonderzahlung: modulEinstellungen?.mietsonderzahlung ?? "",
      eingabeSonderzahlungErmoglichen:
        modulEinstellungen?.eingabeSonderzahlungErmoglichen ?? false,
      pInfoseiteZeigeAlle: modulEinstellungen?.pInfoseiteZeigeAlle ?? false,
      antragOhneArtikelMoglich:
        modulEinstellungen?.antragOhneArtikelMoglich ?? false,
      kundeKannFinanzierungsbetragAndern:
        modulEinstellungen?.kundeKannFinanzierungsbetragAndern ?? false,
    },
    methodsData: {
      zahlungsweisen: methodsData?.zahlungsweisen ?? [],
      produktgruppen: methodsData?.produktgruppen ?? [],
      vertragsarten: methodsData?.vertragsarten ?? [],
    },
  };

  return loaderReturn;
};
