import { useSubmit } from "@remix-run/react";
import { useState, type ChangeEvent } from "react";
import { Switch } from "../switch";
import styles from "./styles.module.css";

type ModulAktivProps = {
  initialValue: boolean;
};

export const ModulAktiv = ({ initialValue }: ModulAktivProps) => {
  const submit = useSubmit();

  const [isModulAktiv, setIsModulAktiv] = useState(initialValue);
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const data = {
      isModulAktiv: e.target.checked,
      _action: "modulAktiv",
    };
    setIsModulAktiv(e.target.checked);
    submit(data, { method: "POST" });
  };

  return (
    <div className={`sectionContainer ${styles.modulAktiv}`}>
      <Switch
        name={"modulAktiv"}
        label="Albis Leasing Modul Aktiv:"
        handleOnChange={handleOnChange}
        checkboxValue={isModulAktiv}
      />
    </div>
  );
};
