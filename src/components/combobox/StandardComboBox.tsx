import { useState, useId } from "react";
import type { Option, StandardComboBoxProps } from "../../types";
import { ComboBoxBase } from "./ComboBoxBase";
import { Combobox } from "@base-ui-components/react/combobox";
import { ChevronDownIcon, CheckIcon, ClearIcon } from "../icons";
import { clsx } from "clsx";

/**
 * Standard single-select combobox with clear button and dropdown
 */
export const StandardComboBox = ({
  label,
  options,
  placeholder = "Select...",
  onChange,
  classes = {},
  readonly = false,
  disabled = false,
}: StandardComboBoxProps) => {
  const [selected, setSelected] = useState<Option | null>(null);
  const id = useId();

  const handleSelect = (value: string | null) => {
    if (disabled) return;
    
    const found = options.find((o) => o.value === value) || null;
    setSelected(found);
    onChange?.(found);
  };

  const handleClear = () => {
    if (disabled) return;
    setSelected(null);
    onChange?.(null);
  };

  const getDisplayValue = () => {
    return selected ? selected.label : "";
  };

  return (
    <ComboBoxBase label={label}>
      <Combobox.Root
        items={options.map((o) => o.value)}  // Combobox expects string values
        value={selected?.value || null}
        onValueChange={handleSelect}
        disabled={disabled}
      >
        <div className="relative">
          {/* Readonly input shows selected value */}
          <Combobox.Input
            id={id}
            placeholder={placeholder}
            value={getDisplayValue()}
            readOnly={readonly}  // Click to open dropdown instead of typing
            disabled={disabled}
            className={clsx(
              "w-full rounded-md border px-3 py-2.5 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              readonly && "cursor-pointer select-none",  // Shows it's clickable
              disabled && "cursor-not-allowed",
              classes.input
            )}
          />

          {/* Clear button (when selected) and dropdown trigger */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {selected && !disabled && (
              <Combobox.Clear
                aria-label="Clear selection"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ClearIcon className="w-4 h-4" />
              </Combobox.Clear>
            )}
            <Combobox.Trigger
              aria-label="Toggle dropdown"
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={disabled}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </Combobox.Trigger>
          </div>
        </div>

        {/* Dropdown with options */}
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup
              className={clsx(
                "w-[--anchor-width] mt-1 rounded-md border bg-white shadow-lg",  // Matches input width
                classes.popup
              )}
            >
              <Combobox.Empty className="px-3 py-2 text-sm text-gray-500">
                No options found
              </Combobox.Empty>

              <Combobox.List className="max-h-60 overflow-y-auto p-1">
                {options.map((option) => (
                  <Combobox.Item
                    key={option.value}
                    value={option.value}
                    className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-50 data-[highlighted]:bg-gray-100"
                  >
                    {/* Checkmark for selected item */}
                    <Combobox.ItemIndicator className="text-blue-600">
                      <CheckIcon className="w-4 h-4" />
                    </Combobox.ItemIndicator>
                    {option.label}
                  </Combobox.Item>
                ))}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </ComboBoxBase>
  );
};