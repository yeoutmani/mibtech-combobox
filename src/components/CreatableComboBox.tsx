import { useState } from "react";
import type { Option } from '../types';
import { ComboBoxBase } from "./ComboBoxBase";

interface Props {
  label?: string;
  options: Option[];
  onCreate?: (newOption: Option) => void;
  onSelect?: (option: Option) => void;
  className?: string;
}

export const CreatableComboBox = ({ label, options, onCreate, onSelect, className }: Props) => {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(input.toLowerCase())
  );

  const exists = options.some(
    (o) => o.label.toLowerCase() === input.toLowerCase()
  );

  const handleCreate = () => {
    if (!input.trim() || exists) return;

    const newOption: Option = {
      value: input.toLowerCase().replace(/\s+/g, "-"),
      label: input,
    };

    onCreate?.(newOption);
    setInput(newOption.label);
    setOpen(false);
  };

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
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setInput(o.label);
                onSelect?.(o);
                setOpen(false);
              }}
            >
              {o.label}
            </div>
          ))}

          {!exists && input.trim() !== "" && (
            <div
              className="px-3 py-2 cursor-pointer text-blue-600 hover:bg-blue-50"
              onClick={handleCreate}
            >
              + Create "{input}"
            </div>
          )}
        </div>
      )}
    </ComboBoxBase>
  );
};
