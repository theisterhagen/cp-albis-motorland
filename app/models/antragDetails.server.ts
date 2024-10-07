import type { AntragDetails } from "@prisma/client";
import db from "../db.server";
import type { AntragDetailsData } from "./types";

export async function createAntragDetails(antragData: AntragDetailsData) {
  try {
    const antragDetailsData = await db.antragDetails.create({
      data: {
        ...antragData,
      },
    });
    return antragDetailsData;
  } catch (error) {
    console.error("create AntragDetails failed", error);
    return null;
  }
}

export async function updateAntragDetails(
  antragData: Partial<AntragDetailsData>,
) {
  try {
    if (!antragData.antragnr) throw new Error("Antragnr not found");
    const antragDetailsData = await db.antragDetails.update({
      where: { antragnr: antragData.antragnr },
      data: {
        ...antragData,
      },
    });
    return antragDetailsData;
  } catch (error) {
    console.error("Failed to update AntragDetails", error);
    return null;
  }
}

export async function getAntragDetails(
  antragnr: AntragDetails["antragnr"],
): Promise<AntragDetails | null> {
  try {
    const AntragDetails = await db.antragDetails.findUnique({
      where: {
        antragnr,
      },
    });
    return AntragDetails;
  } catch (error) {
    console.error("Failed to retrieve AntragDetails", error);
    return null;
  }
}

export async function getAllPendingAntragDetails(): Promise<
  AntragDetails[] | null
> {
  try {
    const AntragDetails = await db.antragDetails.findMany({
      where: {
        complete: false,
      },
    });
    return AntragDetails;
  } catch (error) {
    console.error("Failed to retrieve incomplete AntragDetails", error);
    return null;
  }
}
