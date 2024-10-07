import styles from "./styles.module.css";

type LabelProps = {
  label: string;
  htmlFor?: string;
};
export const Label = ({ label, htmlFor }: LabelProps) => {
  return (
    <label className={styles.label} htmlFor={htmlFor}>
      {label}
    </label>
  );
};
