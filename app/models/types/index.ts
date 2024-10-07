import type { AntragDetails, ModulAktiv } from "@prisma/client";

export type UpdateOrCreateModulAktivServer = Omit<
  ModulAktiv,
  "id" | "ModulZugangsdaten"
>;

export type GetModulAktivServer = {
  shop: string;
  modulAktiv?: boolean;
};

export type AntragDetailsData = Omit<AntragDetails, "id">;
