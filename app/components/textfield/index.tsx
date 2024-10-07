import type { ChangeEvent } from "react";
import { Label } from "../label";
import styles from "./styles.module.css";

type TextFieldProps = {
  label: string;
  name: string;
  textFieldValue: string;
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleOnBlur: () => void;
  handleKeyDown: () => void;
  required?: boolean;
  type?: "text" | "password";
  hidden?: boolean;
};

export const TextField = ({
  label,
  name,
  type = "text",
  hidden = false,
  textFieldValue,
  required = false,
  handleOnChange,
  handleOnBlur,
  handleKeyDown,
}: TextFieldProps) => {
  return (
    <div className={styles.textFieldContainer}>
      <Label label={label} />
      <input
        id={name}
        name={name}
        type={type}
        className={styles.textField}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onKeyDown={(e) => e.key === "Enter" && handleKeyDown()}
        value={textFieldValue}
        style={{ visibility: hidden ? "hidden" : "visible" }}
        required={required}
      />
    </div>
  );
};
