import styles from "./FormField.module.css";

type BaseProps = {
  label: string;
  required?: boolean;
};

type InputProps = BaseProps & {
  as?: "input";
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
};

type SelectProps = BaseProps & {
  as: "select";
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

type TextareaProps = BaseProps & {
  as: "textarea";
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

type FormFieldProps = InputProps | SelectProps | TextareaProps;

export function FormField(props: FormFieldProps) {
  const { label, required } = props;

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>

      {props.as === "select" ? (
        <select
          className={styles.control}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          required={required}
        >
          <option value="">Selecione...</option>
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : props.as === "textarea" ? (
        <textarea
          className={styles.control}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          rows={props.rows ?? 3}
          placeholder={props.placeholder}
        />
      ) : (
        <input
          className={styles.control}
          type={props.type ?? "text"}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          required={required}
        />
      )}
    </div>
  );
}