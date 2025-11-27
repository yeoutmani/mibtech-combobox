import { useState } from "react";
import type { Option } from '../types';
import { ComboBoxBase } from "./ComboBoxBase";

interface Props {
  label?: string;
  options: Option[];
  onChange?: (values: Option[]) => void;
}

export const MultiSelectComboBox = ({ label, options, onChange }: Props) => {
  const [selected, setSelected] = useState<Option[]>([]);

  const toggleSelect = (option: Option) => {
    const exists = selected.find((s) => s.value === option.value);
    const newValues = exists
      ? selected.filter((s) => s.value !== option.value)
      : [...selected, option];

    setSelected(newValues);
    onChange?.(newValues);
  };

  return (
    <ComboBoxBase label={label}>
      <div className="border rounded-md p-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {selected.map((s) => (
            <span
              key={s.value}
              className="px-2 py-1 bg-blue-100 border text-xs rounded"
            >
              {s.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1">
          {options.map((o) => (
            <button
              key={o.value}
              className="text-left px-2 py-1 hover:bg-gray-100"
              onClick={() => toggleSelect(o)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </ComboBoxBase>
  );
};
