'use client';
import * as React from 'react';
import { Combobox } from '@base-ui-components/react/combobox';
import { ChevronDownIcon, ClearIcon, Spinner, CheckIcon } from '../icons';

interface Option {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  loadOptions: (query: string) => Promise<Option[]>;
  className?: string;
}

export const AsyncComboBox = ({ label, loadOptions, className }: Props) => {
  const id = React.useId();
  
  const [options, setOptions] = React.useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<Option | null>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const trimmedSearchValue = searchValue.trim();

  // Ensure the selected item is always in the list
  const items = React.useMemo(() => {
    if (!selectedValue || options.some((option) => option.value === selectedValue.value)) {
      return options;
    }
    return [...options, selectedValue];
  }, [options, selectedValue]);

  function getStatus() {
    if (isPending) {
      return (
        <React.Fragment>
          <Spinner />
          Searching...
        </React.Fragment>
      );
    }

    if (error) {
      return error;
    }

    if (trimmedSearchValue === '') {
      return selectedValue ? null : 'Start typing to search...';
    }

    if (options.length === 0) {
      return `No results for "${trimmedSearchValue}".`;
    }

    return null;
  }

  function getEmptyMessage() {
    if (trimmedSearchValue === '' || isPending || options.length > 0 || error) {
      return null;
    }
    return 'Try another search term.';
  }

  return (
    <Combobox.Root
      items={items}
      itemToStringLabel={(option: Option) => option.label}
      filter={null}
      onOpenChangeComplete={(open) => {
        if (!open && selectedValue) {
          setOptions([selectedValue]);
        }
      }}
      onValueChange={(nextSelectedValue) => {
        setSelectedValue(nextSelectedValue);
        setSearchValue(nextSelectedValue?.label || '');
        setError(null);
      }}
      onInputValueChange={(nextSearchValue, { reason }) => {
        setSearchValue(nextSearchValue);

        const controller = new AbortController();
        abortControllerRef.current?.abort();
        abortControllerRef.current = controller;

        if (nextSearchValue === '') {
          setOptions([]);
          setError(null);
          return;
        }

        if (reason === 'item-press') {
          return;
        }

        startTransition(async () => {
          setError(null);

          try {
            const result = await loadOptions(nextSearchValue);
            
            if (controller.signal.aborted) {
              return;
            }

            startTransition(() => {
              setOptions(result);
              setError(null);
            });
          } catch (err) {
            console.error(err);
            if (controller.signal.aborted) return;
            
            startTransition(() => {
              setError('Error loading options');
              setOptions([]);
            });
          }
        });
      }}
    >
      <div className="label-wrapper">
        {label && <label htmlFor={id}>{label}</label>}
        <div className="input-wrapper">
          <Combobox.Input 
            id={id} 
            placeholder="Tapez pour rechercher..." 
            className={`w-full px-3 py-2 border rounded outline-none ${className ?? ""}`}
          />
          <div className="action-buttons">
            <Combobox.Clear aria-label="Clear selection">
              <ClearIcon />
            </Combobox.Clear>
            <Combobox.Trigger aria-label="Open menu">
              <ChevronDownIcon />
            </Combobox.Trigger>
          </div>
        </div>
      </div>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup 
            className={`combo-input ${className ?? ""}`}
            aria-busy={isPending || undefined}
          >
            <div className="px-3 py-2 text-sm text-gray-500">
              {getStatus()}
            </div>
            <div className="px-3 py-2 text-sm text-gray-500">
              {getEmptyMessage()}
            </div>
            <Combobox.List>
              {(option: Option) => (
                <Combobox.Item 
                  key={option.value} 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  value={option}
                >
                  <Combobox.ItemIndicator>
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                  {option.label}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};