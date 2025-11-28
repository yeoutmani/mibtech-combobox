import React from "react";

interface BaseProps {
  label?: string;
  children: React.ReactNode;
}

export const ComboBoxBase = ({ label, children }: BaseProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <div className="relative">{children}</div>
    </div>
  );
};
