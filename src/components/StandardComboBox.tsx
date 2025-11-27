import { useState } from "react";
import type { Option } from '../types';
import { ComboBoxBase } from "./ComboBoxBase";

interface Props {
  label?: string;
  options: Option[];
  onChange?: (value: Option | null) => void;
}

export const StandardComboBox = ({ label, options, onChange }: Props) => {
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
        className="w-full px-3 py-2 border rounded-md bg-white"
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
