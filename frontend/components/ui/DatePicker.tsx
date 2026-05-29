import { inputClass } from "./FormField";

// Thin wrapper over the native date input — reused wherever a date is picked.
interface Props {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function DatePicker({ id, name, value, onChange }: Props) {
  return (
    <input
      type="date"
      id={id}
      name={name}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      className={inputClass}
    />
  );
}
