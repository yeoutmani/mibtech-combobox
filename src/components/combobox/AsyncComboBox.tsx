import * as React from 'react';
import { Combobox } from '@base-ui-components/react/combobox';
import type { Option, AsyncComboBoxProps } from "../../types";
import { ChevronDownIcon, ClearIcon, Spinner, CheckIcon } from '../icons';
import { clsx } from 'clsx';

export const AsyncComboBox = ({ 
  label, 
  loadOptions, 
  placeholder = "Type to search...",
  debounceMs = 300,
  minChars = 1,
  onChange,
  classes = {},
  disabled = false
}: AsyncComboBoxProps) => {
  const id = React.useId();
  
  const [options, setOptions] = React.useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<Option | null>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = React.useState<ReturnType<typeof setTimeout>>();

  const trimmedSearchValue = searchValue.trim();

  // Ensure the selected item is always in the list
  const items = React.useMemo(() => {
    if (!selectedValue || options.some((option) => option.value === selectedValue.value)) {
      return options;
    }
    return [...options, selectedValue];
  }, [options, selectedValue]);

  const getStatus = () => {
    if (isPending) {
      return (
        <div className={clsx("flex items-center gap-2", classes.loading)}>
          <Spinner />
          <span className="text-sm">Searching...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className={clsx("flex items-center gap-2 text-red-600 text-sm", classes.error)}>
          <span>{error}</span>
        </div>
      );
    }

    if (trimmedSearchValue === '') {
      return selectedValue ? null : <span className="text-sm text-gray-500">Start typing to search...</span>;
    }

    if (trimmedSearchValue.length < minChars) {
      return (
        <span className="text-sm text-gray-500">
          Type at least {minChars} character{minChars > 1 ? 's' : ''}...
        </span>
      );
    }

    // REMOVED: the "No results for..." message here to avoid duplication
    return null;
  };

  // --- DEBOUNCED SEARCH LOGIC ---
  const handleInputChange = React.useCallback((nextSearchValue: string, { reason }: { reason: string }) => {
    if (disabled) return;
    
    setSearchValue(nextSearchValue);

    // Clear existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // If search is empty
    if (nextSearchValue === '') {
      setOptions([]);
      setError(null);
      return;
    }

    // Don't search on item selection
    if (reason === 'item-press') {
      return;
    }

    // Minimum characters check
    if (nextSearchValue.trim().length < minChars) {
      setOptions([]);
      return;
    }

    // Set new debounce timer
    const timer = setTimeout(() => {
      startTransition(async () => {
        setError(null);

        try {
          const result = await loadOptions(nextSearchValue);
          startTransition(() => {
            setOptions(result);
            setError(null);
          });
        } catch (err) {
          console.error('AsyncComboBox error:', err);
          startTransition(() => {
            setError('Failed to load options');
            setOptions([]);
          });
        }
      });
    }, debounceMs);

    setDebounceTimer(timer);
  }, [loadOptions, debounceMs, minChars, disabled, debounceTimer, startTransition]);

  // --- CLEANUP ---
  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleValueChange = (nextSelectedValue: Option | null) => {
    if (disabled) return;
    
    setSelectedValue(nextSelectedValue);
    setSearchValue(nextSelectedValue?.label || '');
    setError(null);
    onChange?.(nextSelectedValue);
  };

  // --- CLEAR HANDLER ---
  const handleClear = () => {
    if (disabled) return;
    
    setSelectedValue(null);
    setSearchValue('');
    setOptions([]);
    setError(null);
    onChange?.(null);
  };

  // --- RENDER ---
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <Combobox.Root
        items={items}
        itemToStringLabel={(option: Option) => option.label}
        filter={null} // We handle filtering server-side
        onOpenChangeComplete={(open) => {
          if (!open && selectedValue) {
            setOptions([selectedValue]);
          }
        }}
        onValueChange={handleValueChange}
        onInputValueChange={handleInputChange}
        disabled={disabled}
      >
        <div className="relative">
          <Combobox.Input 
            id={id} 
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              "w-full rounded-md border px-3 py-2.5 text-sm pr-20",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              classes.input
            )}
          />
          {/* Action buttons */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* ClearIcon - visible when there is text */}
            {searchValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear input"
              >
                <ClearIcon className="w-4 h-4" />
              </button>
            )}
            
            <Combobox.Trigger 
              aria-label="Open menu"
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={disabled}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </Combobox.Trigger>
          </div>
        </div>

        {/* Dropdown */}
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup 
              className={clsx(
                "combo-popup rounded-md shadow-lg bg-white border border-gray-200 min-w-[--anchor-width]",
                classes.popup
              )}
              aria-busy={isPending || undefined}
            >
              {/* Status message (loading, error, instructions) */}
              <div className={clsx(
                "px-3 py-2.5",
                classes.status
              )}>
                {getStatus()}
              </div>
              
              {/* Results list */}
              {!isPending && !error && options.length > 0 && (
                <Combobox.List className="max-h-60 overflow-y-auto p-1">
                  {(option: Option) => (
                    <Combobox.Item 
                      key={option.value} 
                      className={clsx(
                        "px-3 py-2.5 rounded text-sm",
                        "hover:bg-gray-50 cursor-pointer data-[highlighted]:bg-gray-100",
                        "flex items-center gap-3",
                        disabled && "opacity-50 cursor-not-allowed",
                        classes.item
                      )}
                      value={option}
                      disabled={disabled}
                    >
                      <Combobox.ItemIndicator className="text-blue-600 shrink-0">
                        <CheckIcon className="w-4 h-4" />
                      </Combobox.ItemIndicator>
                      <span className="truncate">{option.label}</span>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              )}
              
              {/* No results message */}
              {!isPending && 
               !error && 
               trimmedSearchValue.length >= minChars && 
               options.length === 0 && 
               trimmedSearchValue !== '' && (
                <div className="px-3 py-3 text-sm text-gray-500 text-center">
                  No results found for "{trimmedSearchValue}"
                </div>
              )}
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
};