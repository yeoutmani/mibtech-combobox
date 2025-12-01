import type { Option } from './combobox';

// ============ COMMON TYPES ============
export interface BaseComboBoxClasses {
  input?: string;
  popup?: string;
}

// ============ ASYNC COMBOBOX ============
export interface AsyncComboBoxClasses extends BaseComboBoxClasses {
  status?: string;
  loading?: string;
  error?: string;
  item?: string;
}

export interface AsyncComboBoxProps {
  label?: string;
  loadOptions: (query: string) => Promise<Option[]>;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
  onChange?: (value: Option | null) => void;
  classes?: AsyncComboBoxClasses;
  disabled?: boolean;
}

// ============ AUTOCOMPLETE COMBOBOX ============
export interface AutocompleteComboBoxClasses extends BaseComboBoxClasses {
  searchIcon?: string;
  clearButton?: string;
  item?: string;
}

export interface AutocompleteComboBoxProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: Option | null) => void;
  classes?: AutocompleteComboBoxClasses;
  disabled?: boolean;
}

// ============ CREATABLE COMBOBOX ============
export interface CreatableComboBoxClasses extends BaseComboBoxClasses {
  createButton?: string;
}

export interface CreatableComboBoxProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  onCreate?: (newOption: Option) => void;
  onSelect?: (option: Option | null) => void;
  classes?: CreatableComboBoxClasses;
  disabled?: boolean;
}

// ============ MULTI-SELECT COMBOBOX ============
export interface MultiSelectComboBoxClasses extends BaseComboBoxClasses {
  chip?: string;
  chipRemove?: string;
  item?: string;
  itemSelected?: string;
}

export interface MultiSelectComboBoxProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (values: Option[]) => void;
  classes?: MultiSelectComboBoxClasses;
  disabled?: boolean;
  maxSelections?: number;
}

// ============ STANDARD COMBOBOX ============
export interface StandardComboBoxProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: Option | null) => void;
  classes?: BaseComboBoxClasses; // Standard combobox doesn't have additional class keys beyond base
  readonly?: boolean;
  disabled?: boolean;
}