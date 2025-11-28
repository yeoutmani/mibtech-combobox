import { useState, useId } from "react";
import type { Option } from "../../types";
import { ComboBoxBase } from "./ComboBoxBase";
import { Combobox } from "@base-ui-components/react/combobox";
import { ChevronDownIcon, CheckIcon, ClearIcon } from "../icons";

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
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup className={`combo-input ${className ?? ""}`}>
              <Combobox.Empty className="px-3 py-2 text-sm text-gray-500">
                No options found
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
