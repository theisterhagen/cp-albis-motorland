import { createContext, useCallback, useState, type ReactNode } from "react";
import type { CalcData, FirmaFormData, ManagerFormData } from "../types";
import type { LeasingRate, Rate } from "../types/albisMethods";
import {
  initialCalcFormData,
  initialFirmaFormData,
  initialLeasingData,
  initialManagerFormData,
} from "../utils/constants";

type ClientFormData = {
  firma: FirmaFormData;
  manager: ManagerFormData;
  datenschutz: boolean;
};

export type LeasingData = {
  leasingRate: LeasingRate | null;
  selectedRateOpt: Rate | null;
};

type LeasingCtx = {
  calcFormData: CalcData;
  updateCalcFormData: (newCalcData: Partial<CalcData>) => void;
  clientFormData: ClientFormData;
  updateFirmaData: (info: Partial<FirmaFormData>) => void;
  updateManagerData: (info: Partial<ManagerFormData>) => void;
  updateDatenschutz: (value: boolean) => void;
  leasingData: LeasingData;
  updateLeasingRate: (newRate: LeasingRate) => void;
  updateLeasingSelectedOpt: (selectedOpt: Rate) => void;
  errorData: string;
  updateErrorData: (value: string) => void;
};
export const LeasingCtx = createContext<LeasingCtx>({
  calcFormData: initialCalcFormData,
  updateCalcFormData: () => {},
  clientFormData: {
    firma: initialFirmaFormData,
    manager: initialManagerFormData,
    datenschutz: false,
  },
  updateFirmaData: () => {},
  updateManagerData: () => {},
  updateDatenschutz: () => {},
  leasingData: initialLeasingData,
  updateLeasingRate: () => {},
  updateLeasingSelectedOpt: () => {},
  errorData: "",
  updateErrorData: () => {},
});

type LeasingProviderProps = {
  children: ReactNode;
};
export const LeasingProvider = ({ children }: LeasingProviderProps) => {
  const [calcFormData, setCalcFormData] =
    useState<CalcData>(initialCalcFormData);
  const [clientFormData, setClientFormData] = useState<ClientFormData>({
    firma: initialFirmaFormData,
    manager: initialManagerFormData,
    datenschutz: false,
  });
  const [leasingData, setLeasingData] =
    useState<LeasingData>(initialLeasingData);
  const [errorData, setErrorData] = useState("");

  const updateErrorData = useCallback((error: string): void => {
    setErrorData(error);
  }, []);

  const updateCalcFormData = useCallback(
    (newCalcData: Partial<CalcData>): void => {
      setCalcFormData((prev) => ({ ...prev, ...newCalcData }));
    },
    [],
  );

  const updateFirmaData = useCallback(
    (newFirmaData: Partial<FirmaFormData>) => {
      setClientFormData((prev) => ({
        ...prev,
        firma: { ...prev.firma, ...newFirmaData },
      }));
    },
    [],
  );

  const updateManagerData = useCallback(
    (newManagerData: Partial<ManagerFormData>) => {
      setClientFormData((prev) => ({
        ...prev,
        manager: { ...prev.manager, ...newManagerData },
      }));
    },
    [],
  );

  const updateDatenschutz = useCallback((value: boolean) => {
    setClientFormData((prev) => ({
      ...prev,
      datenschutz: value,
    }));
  }, []);

  const updateLeasingRate = useCallback((newRate: LeasingRate) => {
    setLeasingData((prev) => ({ ...prev, leasingRate: newRate }));
  }, []);

  const updateLeasingSelectedOpt = useCallback((selectedOpt: Rate) => {
    setLeasingData((prev) => ({ ...prev, selectedRateOpt: selectedOpt }));
  }, []);

  return (
    <LeasingCtx.Provider
      value={{
        calcFormData,
        updateCalcFormData,
        clientFormData,
        updateDatenschutz,
        updateFirmaData,
        updateManagerData,
        leasingData,
        updateLeasingRate,
        updateLeasingSelectedOpt,
        errorData,
        updateErrorData,
      }}
    >
      {children}
    </LeasingCtx.Provider>
  );
};
