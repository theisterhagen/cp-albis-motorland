import { useContext } from "react";
import { LeasingCtx } from "../context/leasingCtx";

export const useLeasingCtx = () => {
  return useContext(LeasingCtx);
};
