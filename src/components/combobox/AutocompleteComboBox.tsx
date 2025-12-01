import { Autocomplete } from '@base-ui-components/react/autocomplete';
import type { Option, AutocompleteComboBoxProps } from '../../types';
import { ClearIcon, SearchIcon } from '../icons';
import { clsx } from 'clsx';

/**
 * Autocomplete combobox with search filtering and dropdown suggestions
 */
export const AutocompleteComboBox = ({ 
  label, 
  options, 
  placeholder = "Search...",
  onChange, 
  classes = {},
  disabled = false
}: AutocompleteComboBoxProps) => {
  // Convert string value back to Option object
  const handleValueChange = (value: string | null) => {
    if (disabled) return;
    const selectedOption = options.find(opt => opt.value === value);
    onChange?.(selectedOption || null);
  };

  return (
    <Autocomplete.Root 
      items={options}
      onValueChange={handleValueChange}
      name="search-autocomplete"
      disabled={disabled}
    >
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        {/* Input with clear/search icons */}
        <div className="relative w-full">
          <Autocomplete.Input 
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              "w-full rounded-md border px-3 py-2.5 text-sm pr-20",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              classes.input
            )}
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Clear button */}
            <Autocomplete.Clear 
              aria-label="Clear search"
              className={clsx(
                "p-1",
                disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700",
                classes.clearButton
              )}
              disabled={disabled}
            >
              <ClearIcon className="w-4 h-4" />
            </Autocomplete.Clear>

            {/* Search icon */}
            <div className={clsx(
              "p-1",
              disabled ? "text-gray-300" : "text-gray-500",
              classes.searchIcon
            )}>
              <SearchIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown with filtered results */}
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup className={clsx(
            "combo-popup rounded-md shadow-lg bg-white border border-gray-200",
            classes.popup
          )}>
            {/* Shown when no results match */}
            <Autocomplete.Empty className="px-3 py-2 text-sm text-gray-500 text-center">
              No results found
            </Autocomplete.Empty>
            
            {/* Scrollable list of filtered options */}
            <Autocomplete.List className="max-h-60 overflow-y-auto p-1">
              {(option: Option) => (
                <Autocomplete.Item 
                  key={option.value}
                  className={clsx(
                    "px-3 py-2.5 rounded text-sm",
                    "hover:bg-gray-50 cursor-pointer data-[highlighted]:bg-gray-100",
                    disabled && "opacity-50 cursor-not-allowed",
                    classes.item
                  )}
                  value={option.value}
                  disabled={disabled}
                >
                  {option.label}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
};