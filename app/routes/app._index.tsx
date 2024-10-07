import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { authenticate } from "../shopify.server";

import { Divider } from "../components/divider";
import { ModulAktiv } from "../components/modulAktiv";
import { ModulEinstellungen } from "../components/modulEinstellungen";
import { ModulZugangsdaten } from "../components/modulZugangsdaten";
import styles from "../styles/appStyles.module.css";

import { updateOrCreateModulAktiv } from "~/models/modulAktiv.server";
import { updateOrCreateModulEinstellungen } from "~/models/modulEinstellungen";
import { updateOrCreateModulZugangsdaten } from "~/models/modulZugangsdaten";
import { getPluginConf } from "~/models/pluginConfig.server";
import { formatData } from "~/utils/formatData";
import { getAllMethodData } from "~/utils/getAlbisMethodsData";
import { getLoaderResponse } from "~/utils/getLoaderResponseObj";
import type {
  ActionZugangsdaten,
  ModulEinstellungenData,
  ModulZugangsdatenCredentials,
  PluginConfData,
} from "../types/pluginConfigurator";

export const action: ActionFunction = async ({
  request,
}): Promise<ActionZugangsdaten | null> => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "modulAktiv":
      const isModulAktiv: boolean = values["isModulAktiv"] === "true";
      const modulAktivData = await updateOrCreateModulAktiv({
        shop: session.shop,
        isModulAktiv,
      });

      return modulAktivData
        ? null
        : { error: "Error modulAktivData Modul Zugangsdaten" };
    case "zugangsdaten":
      const credentials = formatData(values) as ModulZugangsdatenCredentials;

      const credentialsDb = await updateOrCreateModulZugangsdaten(
        session.shop,
        {
          apiLink: credentials.apiLink,
          benutzer: credentials.benutzer,
          passwort: credentials.passwort,
          isCredentialsValid: null,
        },
      );

      return credentialsDb
        ? null
        : { error: "Error updating/Creating ModulZugangsdaten" };
    case "einstellungen":
      const einstellungenData = formatData(
        values,
        true,
      ) as ModulEinstellungenData;

      const updatedEinstellungenData = await updateOrCreateModulEinstellungen(
        session.shop,
        einstellungenData,
      );
      return updatedEinstellungenData
        ? null
        : { error: "Error updating/Creating ModulEinstellungen" };
    default:
      return null;
  }
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<PluginConfData> => {
  const { session } = await authenticate.admin(request);
  const pluginConfData = await getPluginConf(session.shop);

  if (!pluginConfData)
    return getLoaderResponse({
      modulAktiv: {
        isModulAktiv: false,
        shop: session.shop,
      },
    });

  const { ModulZugangsdaten, isModulAktiv, shop } = pluginConfData;

  if (!isModulAktiv || !ModulZugangsdaten || !shop)
    return getLoaderResponse({
      modulAktiv: {
        isModulAktiv: isModulAktiv ?? false,
        shop: shop ?? session.shop,
      },
    });
  const credentials = {
    apiLink: ModulZugangsdaten.apiLink,
    benutzer: ModulZugangsdaten.benutzer,
    passwort: ModulZugangsdaten.passwort,
  };
  const { zahlungsweisen, produktgruppen, vertragsarten } =
    await getAllMethodData(credentials);

  const isCredentialsValid =
    !!zahlungsweisen.result &&
    !!produktgruppen.result &&
    !!vertragsarten.result;

  await updateOrCreateModulZugangsdaten(session.shop, {
    ...credentials,
    isCredentialsValid,
  });

  const modulAktiv = {
    isModulAktiv,
    shop,
  };
  const modulZugangsdaten = {
    ...credentials,
    isCredentialsValid,
  };
  const modulEinstellungen = ModulZugangsdaten?.ModulEinstellungen
    ? { ...ModulZugangsdaten.ModulEinstellungen }
    : undefined;

  const methodsData = isCredentialsValid
    ? {
        zahlungsweisen: zahlungsweisen.result,
        produktgruppen: produktgruppen.result,
        vertragsarten: vertragsarten.result,
      }
    : undefined;

  return getLoaderResponse({
    modulAktiv,
    modulZugangsdaten,
    modulEinstellungen,
    isCredentialsValid,
    methodsData,
  });
};

export default function Index() {
  const loaderData = useLoaderData<PluginConfData>();
  const { modulAktiv, modulEinstellungen, modulZugangsdaten, methodsData } =
    loaderData;

  console.log("loaderData", loaderData);

  return (
    <div className={styles.appContainer}>
      <div className={styles.formTitle}>
        <h1>Albis Leasing</h1>
        <p>Konfiguration</p>
      </div>
      <Divider type="main" />
      <ModulAktiv initialValue={modulAktiv.isModulAktiv} />
      {modulAktiv.isModulAktiv && (
        <ModulZugangsdaten initialValues={modulZugangsdaten} />
      )}
      {modulAktiv.isModulAktiv && modulZugangsdaten.isCredentialsValid && (
        <ModulEinstellungen
          initialValues={modulEinstellungen as ModulEinstellungenData}
          methodsData={methodsData}
        />
      )}
    </div>
  );
}
