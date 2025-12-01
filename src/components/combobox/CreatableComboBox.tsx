import { useState } from "react";
import type { Option, CreatableComboBoxProps } from "../../types";
import { ComboBoxBase } from "./ComboBoxBase";
import { ClearIcon, PlusIcon } from "../icons";
import { clsx } from "clsx";

/**
 * Combobox that allows creating new options not in the list
 */
export const CreatableComboBox = ({
  label,
  options,
  placeholder = "Type to create or select...",
  onCreate,
  onSelect,
  classes = {},
  disabled = false,
}: CreatableComboBoxProps) => {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  // Filter options based on input
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(input.toLowerCase())
  );

  // Check if input already exists
  const exists = options.some(
    (o) => o.label.toLowerCase() === input.toLowerCase()
  );

  // Create new option from input text
  const handleCreate = () => {
    if (!input.trim() || exists || disabled) return;

    const newOption: Option = {
      value: input.toLowerCase().replace(/\s+/g, "-"), // Convert to slug
      label: input.trim(),
    };

    onCreate?.(newOption);
    setInput(newOption.label);
    setOpen(false);
    onSelect?.(newOption);
  };

  // Select existing option
  const handleSelect = (option: Option) => {
    if (disabled) return;
    
    setInput(option.label);
    onSelect?.(option);
    setOpen(false);
  };

  // Clear input and selection
  const handleClear = () => {
    if (disabled) return;
    
    setInput("");
    setOpen(false);
    onSelect?.(null);
  };

  return (
    <ComboBoxBase label={label}>
      {/* Input with clear button */}
      <div className="relative w-full">
        <input
          className={clsx(
            "combo-input pr-10 w-full",
            disabled && "opacity-50 cursor-not-allowed",
            classes.input
          )}
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            if (disabled) return;
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)} // Delay for click events
          disabled={disabled}
        />

        {/* Show clear button when there's text */}
        {input.length > 0 && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black"
            aria-label="Clear input"
          >
            <ClearIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown with filtered results + create option */}
      {open && !disabled && (
        <div className={clsx(
          "absolute w-full bg-white border rounded shadow mt-1 z-50 combo-popup",
          classes.popup
        )}>
          {/* Existing filtered options */}
          {filtered.length > 0 && (
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((o) => (
                <div
                  key={o.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onMouseDown={() => handleSelect(o)} // onMouseDown fires before onBlur
                >
                  {o.label}
                </div>
              ))}
            </div>
          )}

          {/* Create new option (shown when input doesn't exist) */}
          {!exists && input.trim() !== "" && (
            <div
              onMouseDown={handleCreate}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 cursor-pointer",
                "text-green-700 hover:bg-green-50 transition-colors select-none",
                "border-t border-gray-100 mt-1",
                classes.createButton
              )}
            >
              <PlusIcon className="w-4 h-4" />
              Create "{input.trim()}"
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && input.trim() === "" && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Start typing to create a new option
            </div>
          )}
        </div>
      )}
    </ComboBoxBase>
  );
};