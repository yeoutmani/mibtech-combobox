import { Autocomplete } from '@base-ui-components/react/autocomplete';
import type { Option } from '../../types';
import { ClearIcon, SearchIcon } from '../icons';


interface Props {
  label?: string;
  options: Option[];
  onChange?: (value: Option | null) => void;
  className?: string;
}

export const AutocompleteComboBox = ({ label, options, onChange, className }: Props) => {
  return (
    <Autocomplete.Root 
      items={options}
      onValueChange={(details) => {
        console.log(details);
        const selectedOption = options.find(opt => opt.value === details);
        onChange?.(selectedOption || null);
      }}
      name="search-autocomplete"
    >
      <label className="combo-label">
        {label}
        <div className="relative w-full">
          <Autocomplete.Input 
            placeholder="Search..." 
            className={`combo-input w-full rounded-md border px-3 py-2 pr-10 text-sm ${className || ''}`}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <SearchIcon className="w-4 h-4 text-gray-500" />
            <Autocomplete.Clear aria-label="Clear" className="p-1 text-gray-500 hover:text-gray-700">
              <ClearIcon className="w-4 h-4" />
            </Autocomplete.Clear>
          </div>
        </div>
      </label>

      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup className={`combo-input ${className ?? ""}`}>
            <Autocomplete.Empty className="px-3 py-2 text-gray-500">
              No results found.
            </Autocomplete.Empty>
            
            <Autocomplete.List className="max-h-60 overflow-auto">
              {(option: Option) => (
                <Autocomplete.Item 
                  key={option.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer data-[highlighted]:bg-gray-100"
                  value={option.value}
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