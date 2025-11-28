import { useState } from "react";
import type { Option } from "../../types";
import { ComboBoxBase } from "./ComboBoxBase";
import { ClearIcon } from "../icons";

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
      {/* WRAPPER for input + clear button */}
      <div className="relative w-full">
        <input
          className={`combo-input ${className ?? ""} pr-10`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
        />

        {/* CLEAR BUTTON */}
        {input.length > 0 && (
          <ClearIcon
            className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black"
            onClick={() => {
              setInput("");
              setOpen(false);
            }}
          />
        )}
      </div>

      {open && (
        <div className={`absolute w-full bg-white border rounded shadow mt-1 z-50 combo-input ${className ?? ""}`}>
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
              onMouseDown={handleCreate}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer 
                        text-blue-700 hover:bg-blue-50 transition-colors select-none"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>

              Create "{input}"
            </div>
          )}
        </div>
      )}
    </ComboBoxBase>
  );
};
