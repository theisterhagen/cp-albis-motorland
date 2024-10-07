import type { ModulEinstellungenData } from "~/types/pluginConfigurator";
import db from "../db.server";
import { getModulZugangsdaten } from "./modulZugangsdaten";

async function updateModulEinstellungen(
  id: number,
  modulEinstellungen: ModulEinstellungenData,
) {
  try {
    const einstellungenUpdatedData = await db.modulEinstellungen.update({
      where: { id },
      data: { ...modulEinstellungen },
    });
    return einstellungenUpdatedData;
  } catch (error) {
    console.error("Update Modul Einstellungen failed", error);
  }
}

async function createModulEinstellungen(
  id: number,
  modulEinstellungen: ModulEinstellungenData,
) {
  const modulEinstellungenData = await db.modulEinstellungen.create({
    data: {
      ...modulEinstellungen,
      zugangsdaten: {
        connect: { id },
      },
    },
  });
  return modulEinstellungenData;
}

export async function updateOrCreateModulEinstellungen(
  shop: string,
  modulEinstellungen: ModulEinstellungenData,
) {
  try {
    const modulZugangsdatenData = await getModulZugangsdaten(shop);
    if (!modulZugangsdatenData) return null;
    const { id } = modulZugangsdatenData;

    const updatedZugangsdatenData = await updateModulEinstellungen(
      id,
      modulEinstellungen,
    );
    if (updatedZugangsdatenData) return updatedZugangsdatenData;

    const newModulEinstellungen = await createModulEinstellungen(
      id,
      modulEinstellungen,
    );
    return newModulEinstellungen;
  } catch (error) {
    console.error("Create Modul Einstellungen failed", error);
  }
}

export async function getModulEinstellungen(shop: string) {
  try {
    const pluginConfig = await db.modulAktiv.findUnique({
      where: { shop },
      include: {
        ModulZugangsdaten: {
          include: {
            ModulEinstellungen: true,
          },
        },
      },
    });
    if (!pluginConfig || !pluginConfig?.ModulZugangsdaten) return null;

    return pluginConfig.ModulZugangsdaten.ModulEinstellungen;
  } catch (error) {
    console.error("Get Modul Einstellungen failed", error);
  }
}
