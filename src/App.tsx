import { useState } from "react";
import {
  StandardComboBox,
  MultiSelectComboBox,
  AutocompleteComboBox,
  CreatableComboBox,
  AsyncComboBox
} from "./components/combobox";

import type { Option } from "./types";

import "./styles/combobox.css";

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
    { value: "symfony", label: "Symfony" },
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
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-pink-100 flex items-start justify-center py-16 px-6">
      <div className="w-full max-w-6xl mx-auto">

        {/* MAIN TITLE */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12 tracking-tight">
          ComboBox Playground
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* STANDARD SELECT */}
          <section className="combo-card">
            <h2 className="combo-title">Standard Select</h2>

            <StandardComboBox
              label="Choose a language"
              options={options}
              onChange={(value) => console.log("Standard:", value)}
              className="combo-input"
            />
          </section>

          {/* CREATABLE COMBO */}
          <section className="combo-card">
            <h2 className="combo-title">Creatable Combo</h2>

            <CreatableComboBox
              label="Create or Select"
              options={options}
              onCreate={(newOption) => {
                setOptions([...options, newOption]);
                console.log("Created:", newOption);
              }}
              onSelect={(value) => console.log("Selected:", value)}
              className="combo-input"
            />
          </section>

          {/* AUTOCOMPLETE */}
          <section className="combo-card">
            <h2 className="combo-title">Autocomplete</h2>

            <AutocompleteComboBox
              label="Search a language"
              options={options}
              onChange={(value) => console.log("Autocomplete:", value)}
              className="combo-input"
            />
          </section>

          {/* MULTI SELECT */}
          <section className="combo-card">
            <h2 className="combo-title">Multi-Select</h2>

            <MultiSelectComboBox
              label="Select multiple"
              options={options}
              onChange={(values) => console.log("Multi:", values)}
              className="combo-input"
            />
          </section>

          {/* ASYNC COMBO */}
          <section className="combo-card">
            <h2 className="combo-title">Async Combo</h2>

            <AsyncComboBox
              label="Load remote options"
              loadOptions={loadRemoteOptions}
              className="combo-input"
            />
          </section>

        </div>
      </div>
    </div>
  );
}
