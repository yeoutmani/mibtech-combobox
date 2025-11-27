import { useEffect, useState } from "react";
import type { Option } from '../types';
import { ComboBoxBase } from "./ComboBoxBase";

interface Props {
  label?: string;
  loadOptions: (query: string) => Promise<Option[]>;
}

export const AsyncComboBox = ({ label, loadOptions }: Props) => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOptions(input).then(setOptions);
    }, 300);
    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <ComboBoxBase label={label}>
      <input
        className="w-full px-3 py-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="absolute w-full bg-white border rounded shadow mt-1 z-10">
        {options.map((o) => (
          <div
            key={o.value}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => setInput(o.label)}
          >
            {o.label}
          </div>
        ))}
      </div>
    </ComboBoxBase>
  );
};
