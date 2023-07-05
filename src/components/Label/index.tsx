import type { ReactNode } from "react";

import { Spacer } from "../Spacer";

interface LabelProps {
  children: ReactNode;
  htmlFor: string;
  label: string;
}

export const Label = ({ children, htmlFor, label }: LabelProps) => {
  return (
    <label htmlFor={htmlFor}>
      <span className="block font-medium">{label}</span>

      <Spacer size="small" />

      {children}
    </label>
  );
};
