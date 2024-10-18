import { useEffect, useState } from "react";

// import { z } from "zod";
import type { PluginConfig } from "../types/pluginConfig";

// const modulAktivSchema = z.object({
//   isModulAktiv: z.boolean(),
// });

// const modulZugangsdatenSchema = z.object({
//   isCredentialsValid: z.boolean().nullable(),
// });

// const modulEinstellungenSchema = z.object({
//   vertragsart: z.string(),
//   restwertInBeiTAVertrag: z.boolean(),
//   produktgruppe: z.string(),
//   produktgruppeLabel: z.string(),
//   zahlungsweisen: z.string(),
//   auswahlZahlungsweiseAnzeigen: z.boolean(),
//   minLeasingsumme: z.string(),
//   servicePauschaleNetto: z.string(),
//   albisServiceGebuhrNetto: z.string(),
//   provisionsangabe: z.string(),
//   objektVersicherung: z.boolean(),
//   auswahlObjektVersicherungAnzeigen: z.boolean(),
//   mietsonderzahlung: z.string(),
//   eingabeSonderzahlungErmoglichen: z.boolean(),
//   pInfoseiteZeigeAlle: z.boolean(),
//   antragOhneArtikelMoglich: z.boolean(),
//   kundeKannFinanzierungsbetragAndern: z.boolean(),
// });

// const pluginConfigSchema = z.object({
//   modulAktiv: modulAktivSchema,
//   modulZugangsdaten: modulZugangsdatenSchema,
//   modulEinstellungen: modulEinstellungenSchema,
// });

type UseGetPluginConfDataProps = {
  shop: string;
};

export const useGetPluginConfData = ({ shop }: UseGetPluginConfDataProps) => {
  const [pluginConfData, setPluginConfData] = useState<PluginConfig>();

  useEffect(() => {
    if (!shop) return;
    const getPluginConfData = async () => {
      try {
        const parameters = new URLSearchParams({ shop });
        const requestUrl = `https://cp-albis-motorland.cpro-server.de/api/getPluginConfData?${parameters}`;

        const response = await fetch(requestUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: PluginConfig = await response.json();
        // const formattedData = pluginConfigSchema.parse(data);
        setPluginConfData(data);
        return data;
      } catch (error) {
        console.error("Error fetching AppConfig:", error);
      }
    };
    getPluginConfData();
  }, []);

  return pluginConfData;
};
