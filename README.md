# Mibtech ComboBox Components

A collection of flexible, accessible, and fully-typed React ComboBox components built with TypeScript and Vite. Perfect for building modern search, selection, and filtering interfaces.

## ✨ Features

- **5 Specialized Components** - Standard, Multi-select, Async, Autocomplete, and Creatable
- **Full TypeScript Support** - End-to-end type safety with comprehensive prop types
- **Zero Dependencies** - Only depends on React and your styling solution
- **Accessible by Design** - Built with WAI-ARIA patterns and keyboard navigation
- **Fully Customizable** - Style every part with CSS classes
- **Async Ready** - Built-in debouncing and loading states
- **Production Ready** - Edge-case handling and error states included

## Quick Start

### Installation

```bash
npm install @base-ui-components/react clsx
```

### Run the Project

To start the development server and view the ComboBox components in your browser:

```bash
npm install
npm run dev
```

This will launch Vite and open the app at `http://localhost:5173` (or the port shown in your terminal).

## Basic Usage

Import the desired ComboBox component and the `Option` type:

```tsx
import {
  StandardComboBox,
  MultiSelectComboBox,
  AutocompleteComboBox,
  CreatableComboBox,
  AsyncComboBox
} from './components/combobox';
import type { Option } from './types';
```

## Option Type

Each ComboBox works with options of the following shape:

```typescript
export type Option = {
  value: string;
  label: string;
};
```

## Components

### 1. StandardComboBox
Single-select dropdown with clear button.
```tsx
<StandardComboBox
  label="Choose a language"
  options={options}
  onChange={(value) => console.log(value)}
  classes={{ input: 'combo-input', popup: 'combo-popup' }}
  readonly={true}
/>
```

### 2. MultiSelectComboBox
Select multiple options with chips and selection limit.
```tsx
<MultiSelectComboBox
  label="Select multiple"
  options={options}
  onChange={(values) => console.log(values)}
  classes={{ input: 'combo-input', popup: 'combo-popup', chip: 'chip-class' }}
  maxSelections={3}
/>
```

### 3. AutocompleteComboBox
Search and filter options with autocomplete dropdown.
```tsx
<AutocompleteComboBox
  label="Search a language"
  options={options}
  onChange={(value) => console.log(value)}
  classes={{ input: 'combo-input', popup: 'combo-popup' }}
/>
```

### 4. CreatableComboBox
Create new options not in the list.
```tsx
<CreatableComboBox
  label="Create or Select"
  options={options}
  onCreate={(newOption) => setOptions([...options, newOption])}
  onSelect={(value) => console.log(value)}
  classes={{ input: 'combo-input', popup: 'combo-popup', createButton: 'create-btn-class' }}
/>
```

### 5. AsyncComboBox
Load options asynchronously (e.g., from API).
```tsx
const loadRemoteOptions = async (query: string): Promise<Option[]> => {
  // Fetch or filter options here
  return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
};

<AsyncComboBox
  label="Load remote options"
  loadOptions={loadRemoteOptions}
  onChange={(value) => console.log(value)}
  classes={{ input: 'combo-input', popup: 'combo-popup' }}
  debounceMs={500}
  minChars={2}
/>
```

## Customization
- Use the `classes` prop to override styles for input, popup, chips, etc.
- See `src/styles/combobox.css` for default styles.

## Props Reference
All components accept a `label`, `options`, and `onChange` callback. See `src/types/combobox-types.ts` for full prop definitions and customization options.
