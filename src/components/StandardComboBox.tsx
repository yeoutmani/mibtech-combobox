import { useState } from "react";
import type { Option } from '../types';
import { ComboBoxBase } from "./ComboBoxBase";

interface Props {
  label?: string;
  options: Option[];
  onChange?: (value: Option | null) => void;
  className?: string;
}

export const StandardComboBox = ({ label, options, onChange, className }: Props) => {
  const [selected, setSelected] = useState<Option | null>(null);

  const handleSelect = (value: Option) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <ComboBoxBase label={label}>
      <select
        value={selected?.value || ""}
        onChange={(e) =>
          handleSelect(
            options.find((o) => o.value === e.target.value) || options[0]
          )
        }
        className={`combo-input ${className ?? ""}`}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </ComboBoxBase>
  );
};
