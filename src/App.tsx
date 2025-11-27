import { useState } from "react";
import {
  StandardComboBox,
  MultiSelectComboBox,
  AutocompleteComboBox,
  CreatableComboBox,
  AsyncComboBox
} from "./components";

import type { Option } from './types';

export default function App() {
  const [options, setOptions] = useState<Option[]>([
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "typescript", label: "TypeScript" },
    { value: "react", label: "React" },
    { value: "next", label: "Next.js" },
    { value: "angular", label: "Angular" },
    { value: "nodejs", label: "Node.js" },
    { value: "django", label: "Django" },
    { value: "symfony", label: "Symfony" }
  ]);

  const loadRemoteOptions = async (query: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase())
          )
        );
      }, 500);
    });
  };

  return (
    <div>
      <section>
        <StandardComboBox
          label="Choose a language or framework"
          options={options}
          onChange={(value) => console.log("Standard:", value)}
        />
      </section>
      <section>
        <MultiSelectComboBox
          label="Choose multiple languages or frameworks"
          options={options}
          onChange={(values) => console.log("Multi:", values)}
        />
      </section>
      <section>
        <AutocompleteComboBox
          label="Search a language or framework"
          options={options}
          onChange={(value) => console.log("Autocomplete:", value)}
        />
      </section>
      <section>
        <CreatableComboBox
          label="Create or Select a language or framework"
          options={options}
          onCreate={(newOption) => {
            setOptions([...options, newOption]);
            console.log("Created:", newOption);
          }}
          onSelect={(value) => console.log("Selected:", value)}
        />
      </section>
      <section>
        <AsyncComboBox
          label="Search remote language or framework"
          loadOptions={loadRemoteOptions}
        />
      </section>
    </div>
  );

}
