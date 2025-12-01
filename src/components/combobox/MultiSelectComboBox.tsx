import * as React from 'react';
import { Combobox } from '@base-ui-components/react/combobox';
import type { Option, MultiSelectComboBoxProps } from "../../types";
import { CheckIcon, XIcon } from '../icons';
import { clsx } from 'clsx';

/**
 * Multi-select combobox with chips display and selection limits
 */
export const MultiSelectComboBox = ({
  label,
  options,
  placeholder = 'Select options...',
  onChange,
  classes = {},
  disabled = false,
  maxSelections,
}: MultiSelectComboBoxProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();
  const [selectedValues, setSelectedValues] = React.useState<Option[]>([]);

  const handleValueChange = (values: Option[]) => {
    if (disabled) return;
    
    // Apply maxSelections limit if specified
    const limitedValues = maxSelections 
      ? values.slice(0, maxSelections)
      : values;
    
    setSelectedValues(limitedValues);
    onChange?.(limitedValues);
  };

  // Check if more selections are allowed
  const canSelectMore = selectedValues.length < (maxSelections || Infinity);

  // Dynamic placeholder shows limit info
  const getInputPlaceholder = () => {
    if (selectedValues.length > 0) return '';
    if (maxSelections) return `${placeholder} (max: ${maxSelections})`;
    return placeholder;
  };

  return (
    <Combobox.Root 
      items={options} 
      multiple 
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
          {label}
        </label>
      )}
      
      {/* Container for chips and input */}
      <Combobox.Chips 
        className={clsx(
          "combo-input flex flex-wrap gap-2 p-3",
          "focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200",
          disabled && "opacity-50 cursor-not-allowed",
          classes.input
        )} 
        ref={containerRef}
      >
        <Combobox.Value>
          {(values: Option[]) => {
            const displayValues = maxSelections 
              ? values.slice(0, maxSelections)
              : values;

            return (
              <>
                {/* Selected items as chips */}
                {displayValues.map((option) => (
                  <Combobox.Chip
                    key={option.value}
                    className={clsx(
                      "px-3 py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50",
                      "text-purple-700 border border-purple-200 text-sm rounded-full",
                      "flex items-center gap-2 hover:from-purple-100 hover:to-indigo-100",
                      classes.chip
                    )}
                    aria-label={option.label}
                  >
                    <span className="font-medium">{option.label}</span>
                    {/* Remove button */}
                    {!disabled && (
                      <Combobox.ChipRemove 
                        className={clsx(
                          "hover:bg-purple-200 rounded-full p-1 transition-colors",
                          "ml-1 -mr-1",
                          classes.chipRemove
                        )}
                        aria-label={`Remove ${option.label}`}
                      >
                        <XIcon className="w-3 h-3" />
                      </Combobox.ChipRemove>
                    )}
                  </Combobox.Chip>
                ))}
                
                {/* Input for filtering/searching */}
                <Combobox.Input
                  id={id}
                  placeholder={getInputPlaceholder()}
                  disabled={!!(disabled || (maxSelections && selectedValues.length >= maxSelections))}
                  className={clsx(
                    "flex-1 min-w-[120px] outline-none bg-transparent",
                    "placeholder:text-gray-400 text-sm",
                    disabled && "cursor-not-allowed",
                    maxSelections && selectedValues.length >= maxSelections && "cursor-not-allowed"
                  )}
                />
              </>
            );
          }}
        </Combobox.Value>
      </Combobox.Chips>

      {/* Selection counter when maxSelections is set */}
      {maxSelections && (
        <div className="mt-1 text-xs text-gray-500 flex justify-between">
          <span>
            {selectedValues.length} of {maxSelections} selected
          </span>
          {selectedValues.length >= maxSelections && (
            <span className="text-purple-600 font-medium">
              Maximum reached
            </span>
          )}
        </div>
      )}

      {/* Dropdown with filtered options */}
      <Combobox.Portal>
        <Combobox.Positioner 
          sideOffset={8} 
          anchor={containerRef}
        >
          <Combobox.Popup className={clsx(
            "combo-popup rounded-2xl shadow-xl border border-purple-100 bg-white",
            classes.popup
          )}>
            <Combobox.Empty className="px-4 py-3 text-gray-500 text-sm text-center">
              {placeholder ? `No results for "${placeholder}"` : "No options found"}
            </Combobox.Empty>
            
            <Combobox.List className="max-h-60 overflow-y-auto p-2">
              {(option: Option) => {
                const isSelected = selectedValues.some(v => v.value === option.value);
                const isDisabled = disabled || (!canSelectMore && !isSelected);

                return (
                  <Combobox.Item 
                    key={option.value} 
                    value={option}
                    disabled={isDisabled}
                    className={clsx(
                      "px-3 py-2.5 rounded-xl cursor-pointer text-sm",
                      "flex items-center gap-3",
                      "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50",
                      "data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-purple-100 data-[highlighted]:to-pink-100",
                      isSelected && clsx(
                        "bg-gradient-to-r from-purple-50 to-pink-50",
                        "text-purple-700 font-medium",
                        classes.itemSelected
                      ),
                      isDisabled && "opacity-50 cursor-not-allowed",
                      classes.item
                    )}
                  >
                    {/* Checkmark for selected items */}
                    <Combobox.ItemIndicator className="text-purple-600">
                      <CheckIcon className="w-4 h-4" />
                    </Combobox.ItemIndicator>
                    <div className="flex-1">{option.label}</div>
                    
                    {/* "Max" badge when item cannot be selected */}
                    {isDisabled && !isSelected && maxSelections && (
                      <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded">
                        Max
                      </span>
                    )}
                  </Combobox.Item>
                );
              }}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};