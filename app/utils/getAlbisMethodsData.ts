import { getPluginConf } from "../models/pluginConfig.server";
import type {
  Antragsdaten,
  GetProduktgruppen,
  GetVertragsarten,
  GetZahlungsweisen,
  Method,
} from "../types/methods";
import type { ModulZugangsdatenCredentials } from "../types/pluginConfigurator";

type GetRate = {
  kaufpreis: string;
  prodgrp: string;
  mietsz: string;
  vertragsart: string;
  zahlweise: string;
};
export interface GetMethodsDataRequest {
  method: Method;
  credentials?: ModulZugangsdatenCredentials;
  shop?: string;
  werte?: GetRate;
  antragsdaten?: Antragsdaten;
  antragnr?: number;
}

const getRequestTemplate = (template: GetMethodsDataRequest) => {
  const extraParams = Object.entries(template).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && key !== "method" && key !== "credentials") {
        acc[key] = value;
      }
      return acc;
    },
    {} as { [key: string]: unknown },
  );
  const requestBody = {
    jsonrpc: "2.0",
    method: template.method,
    params: {
      login: template.credentials?.benutzer,
      pwd: template.credentials?.passwort,
      ...extraParams,
    },
    id: 1,
  };

  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...requestBody }),
  };
};

export const getAlbisMethodsData = async ({
  method,
  antragnr,
  antragsdaten,
  credentials,
  shop,
  werte,
}: GetMethodsDataRequest) => {
  const pluginConfData = !credentials && shop && (await getPluginConf(shop));
  const requestCredentials =
    pluginConfData && pluginConfData.ModulZugangsdaten
      ? {
          apiLink: pluginConfData.ModulZugangsdaten.apiLink,
          benutzer: pluginConfData.ModulZugangsdaten.benutzer,
          passwort: pluginConfData.ModulZugangsdaten.passwort,
        }
      : credentials;

  if (!requestCredentials) {
    return new Response("Invalid credentials", {
      status: 401,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  const methodsPromise = await fetch(
    requestCredentials.apiLink,
    getRequestTemplate({
      method,
      credentials: requestCredentials,
      werte,
      antragsdaten,
      antragnr,
    }),
  );

  if (!methodsPromise.ok) {
    throw new Error(
      `HTTP error! status: ${methodsPromise.status} for method: ${method}`,
    );
  }
  const methodsData = await methodsPromise.json();
  return methodsData;
};

export const getAllMethodData = async (
  credentials: ModulZugangsdatenCredentials,
) => {
  const [zahlungsweisen, produktgruppen, vertragsarten]: [
    GetZahlungsweisen,
    GetProduktgruppen,
    GetVertragsarten,
  ] = await Promise.all([
    getAlbisMethodsData({ method: "getZahlungsweisen", credentials }),
    getAlbisMethodsData({ method: "getProduktgruppen", credentials }),
    getAlbisMethodsData({ method: "getVertragsarten", credentials }),
  ]);

  return { zahlungsweisen, produktgruppen, vertragsarten };
};
