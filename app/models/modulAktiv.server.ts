import db from "../db.server";
import type { UpdateOrCreateModulAktivServer } from "./types";

async function createModulAktiv(
  modulAktivData: UpdateOrCreateModulAktivServer,
) {
  try {
    const newAktivData = await db.modulAktiv.create({
      data: { ...modulAktivData },
    });
    return newAktivData;
  } catch (error) {
    console.error("Create ModulAktiv failed", error);
    return null;
  }
}

export async function updateOrCreateModulAktiv(
  modulAktivData: UpdateOrCreateModulAktivServer,
) {
  try {
    const data = await updateModulAktiv(modulAktivData);
    if (data) return data;

    const newModulAktiv = createModulAktiv(modulAktivData);
    return newModulAktiv;
  } catch (error) {
    console.error("Create ModulAktiv failed", error);
  }
}

export async function updateModulAktiv(
  modulAktiv: UpdateOrCreateModulAktivServer,
) {
  try {
    const { isModulAktiv, shop } = modulAktiv;
    const modulAktivData = await db.modulAktiv.update({
      where: { shop },
      data: { isModulAktiv },
    });
    return modulAktivData;
  } catch (error) {
    console.error("Update ModulAktiv failed", error);
  }
}

export async function getModulAktiv(shop: string) {
  try {
    const modulAktivData = await db.modulAktiv.findUnique({
      where: { shop },
    });
    return modulAktivData;
  } catch (error) {
    console.error("Create ModulAktiv failed", error);
    return null;
  }
}
