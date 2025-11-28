import { useState } from "react";
import type { Option } from '../types';
import { ComboBoxBase } from "./ComboBoxBase";

interface Props {
  label?: string;
  options: Option[];
  onChange?: (value: Option | null) => void;
  className?: string;
}

export const AutocompleteComboBox = ({ label, options, onChange, className }: Props) => {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <ComboBoxBase label={label}>
      <input
        className={`combo-input ${className ?? ""}`}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
        }}
      />

      {open && (
        <div className="absolute w-full bg-white border rounded shadow mt-1 z-10">
          {filtered.map((o) => (
            <div
              key={o.value}
              onClick={() => {
                setInput(o.label);
                onChange?.(o);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </ComboBoxBase>
  );
};
