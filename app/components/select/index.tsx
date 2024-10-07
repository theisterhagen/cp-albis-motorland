import type { ChangeEvent } from "react";
import type { OptionsMethodData } from "~/utils/formatData";
import { Label } from "../label";
import styles from "./styles.module.css";

type SelectProps = {
  label: string;
  name: string;
  handleOnChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  optionsData: OptionsMethodData;
  required?: boolean;
};

export const Select = ({
  label,
  name,
  optionsData,
  handleOnChange,
  required = false,
}: SelectProps) => {
  return (
    <div className={styles.selectContainer}>
      <Label label={label} />
      <select
        id={name}
        name={name}
        className={styles.select}
        onChange={handleOnChange}
        required={required}
      >
        <option value="" disabled selected>
          Please select an option
        </option>
        {optionsData &&
          optionsData.map((item) => (
            <option
              key={`id-${item.id}`}
              value={item.id}
              selected={item?.selected}
            >
              {item.labelValue}
            </option>
          ))}
      </select>
    </div>
  );
};
