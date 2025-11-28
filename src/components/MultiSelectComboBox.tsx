import { useState } from "react";
import type { Option } from "../types";
import { ComboBoxBase } from "./ComboBoxBase";

interface Props {
  label?: string;
  options: Option[];
  onChange?: (values: Option[]) => void;
  className?: string;
}

export const MultiSelectComboBox = ({
  label,
  options,
  onChange,
  className,
}: Props) => {
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
      <div className={`combo-input ${className ?? ""}`}>
        <div className="flex flex-wrap gap-1 mb-2">
          {selected.map((s) => (
            <span
              key={s.value}
              className="px-2 py-1 bg-blue-100 text-blue-700 border border-blue-300 text-xs rounded-md"
            >
              {s.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className="text-left w-full px-2 py-1 hover:bg-gray-100 transition rounded"
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
