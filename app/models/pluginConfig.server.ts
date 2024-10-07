import db from "../db.server";

export async function getPluginConf(shop: string) {
  const pluginConfData = await db.modulAktiv.findUnique({
    where: { shop },
    include: {
      ModulZugangsdaten: {
        include: {
          ModulEinstellungen: true,
        },
      },
    },
  });

  return { ...pluginConfData };
}

export async function getPluginConfToFrontStore(shop: string) {
  const pluginConfData = await db.modulAktiv.findUnique({
    where: { shop },
    include: {
      ModulZugangsdaten: {
        include: {
          ModulEinstellungen: true,
        },
      },
    },
  });
  if (
    !pluginConfData ||
    !pluginConfData.ModulZugangsdaten ||
    !pluginConfData?.ModulZugangsdaten?.ModulEinstellungen
  )
    return;
  const {
    isModulAktiv,
    ModulZugangsdaten: { ModulEinstellungen },
  } = pluginConfData;
  const { id, zugangsdatenId, ...einstellungenRest } = ModulEinstellungen;

  const dataToFrontStore = {
    modulAktiv: {
      isModulAktiv: isModulAktiv,
    },
    modulZugangsdaten: {
      isCredentialsValid: pluginConfData.ModulZugangsdaten.isCredentialsValid,
    },
    modulEinstellungen: {
      ...einstellungenRest,
    },
  };

  return { ...dataToFrontStore };
}
