"use client";

import { useState, useId } from "react";
import type { Option } from "../types";
import { ComboBoxBase } from "./ComboBoxBase";
import { Combobox } from "@base-ui-components/react/combobox";

interface Props {
  label?: string;
  options: Option[];
  onChange?: (value: Option | null) => void;
  className?: string;
}

export const StandardComboBox = ({ label, options, onChange, className }: Props) => {
  const [selected, setSelected] = useState<Option | null>(null);
  const id = useId();

  const handleSelect = (value: string | null) => {
    const found = options.find((o) => o.value === value) || null;
    setSelected(found);
    onChange?.(found);
  };

  return (
    <ComboBoxBase label={label}>
      <Combobox.Root
        items={options.map((o) => o.value)}
        value={selected?.value || null}
        onValueChange={handleSelect}
      >
        <div className="relative w-full">
          <Combobox.Input
            id={id}
            placeholder="Select..."
            className="combo-input w-full rounded-md border px-3 py-2 text-sm"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Combobox.Clear aria-label="Clear" className="p-1 text-gray-500">
              <ClearIcon className="w-4 h-4" />
            </Combobox.Clear>
            <Combobox.Trigger aria-label="Open" className="p-1">
              <ChevronDownIcon className="w-4 h-4" />
            </Combobox.Trigger>
          </div>
        </div>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} className="min-w-(--anchor-width) w-[--anchor-width]">
            <Combobox.Popup className={`rounded-md shadow bg-white border p-1 combo-input ${className ?? ""}`}>
              <Combobox.Empty className="px-3 py-2 text-sm text-gray-500">
                Aucune option trouvée
              </Combobox.Empty>

              <Combobox.List className="max-h-60 overflow-auto">
                {(value: string) => {
                  const option = options.find((o) => o.value === value)!;

                  return (
                    <Combobox.Item
                      key={option.value}
                      value={option.value}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Combobox.ItemIndicator>
                        <CheckIcon className="w-3 h-3 text-blue-600" />
                      </Combobox.ItemIndicator>
                      <span>{option.label}</span>
                    </Combobox.Item>
                  );
                }}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </ComboBoxBase>
  );
};

// -------------------------------------------------------
// Icons
// -------------------------------------------------------

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentColor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

function ClearIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
