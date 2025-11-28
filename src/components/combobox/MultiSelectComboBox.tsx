'use client';
import * as React from 'react';
import { Combobox } from '@base-ui-components/react/combobox';
import type { Option } from "../../types";
import { CheckIcon ,XIcon } from '../icons';
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
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const id = React.useId();

  const handleValueChange = (selectedValues: Option[]) => {
    onChange?.(selectedValues);
  };

  return (
    <Combobox.Root 
      items={options} 
      multiple 
      onValueChange={handleValueChange}
    >
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
            {label}
          </label>
        )}
        
        <Combobox.Chips className={`flex flex-wrap gap-1 p-2 ${className ?? ""}`} ref={containerRef}>
          <Combobox.Value>
            {(value: Option[]) => (
              <React.Fragment>
                {value.map((option) => (
                  <Combobox.Chip
                    key={option.value}
                    className="px-2 py-1 bg-blue-100 text-blue-700 border border-blue-300 text-xs rounded-md flex items-center gap-1"
                    aria-label={option.label}
                  >
                    {option.label}
                    <Combobox.ChipRemove 
                      className="hover:bg-blue-200 rounded-sm p-0.5" 
                      aria-label={`Remove ${option.label}`}
                    >
                      <XIcon />
                    </Combobox.ChipRemove>
                  </Combobox.Chip>
                ))}
                <Combobox.Input
                  id={id}
                  placeholder={value.length > 0 ? '' : 'Select options...'}
                  className="flex-1 min-w-[120px] outline-none bg-transparent"
                />
              </React.Fragment>
            )}
          </Combobox.Value>
        </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner 
          sideOffset={4} 
          anchor={containerRef}
        >
          <Combobox.Popup className={`combo-input ${className ?? ""}`}>
            <Combobox.Empty className="px-3 py-2 text-gray-500 text-sm">
              No options found.
            </Combobox.Empty>
            <Combobox.List>
              {(option: Option) => (
                <Combobox.Item 
                  key={option.value} 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  value={option}
                >
                  <Combobox.ItemIndicator className="text-blue-600">
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                  <div>{option.label}</div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};