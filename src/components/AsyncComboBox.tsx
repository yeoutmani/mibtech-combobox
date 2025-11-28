import { useEffect, useState } from "react";
import type { Option } from '../types';
import { ComboBoxBase } from "./ComboBoxBase";

interface Props {
  label?: string;
  loadOptions: (query: string) => Promise<Option[]>;
  className?: string;
}

export const AsyncComboBox = ({ label, loadOptions, className }: Props) => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const result = await loadOptions(input);
      setOptions(result);
    }, 300);

    return () => clearTimeout(timeout);
  }, [input, loadOptions]);

  return (
    <ComboBoxBase label={label}>
      <input
        className={`w-full px-3 py-2 border rounded ${className ?? ""}`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className={`absolute w-full bg-white border rounded shadow mt-1 z-10 ${className ?? ""}`}>
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
