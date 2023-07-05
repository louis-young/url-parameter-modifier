import type { HTMLInputTypeAttribute } from "react";

export interface TextInputProps {
  ariaLabel?: string;
  id?: string;
  isDisabled?: boolean;
  isReadonly?: boolean;
  isRequired?: boolean;
  onValueChange?: (newValue: string) => void;
  placeholder?: string;
  type: Extract<
    HTMLInputTypeAttribute,
    "email" | "password" | "search" | "tel" | "text" | "url"
  >;
  value: string;
}

export const TextInput = ({
  ariaLabel,
  id,
  isDisabled = false,
  isReadonly = false,
  isRequired = false,
  onValueChange,
  placeholder = "",
  type,
  value,
}: TextInputProps) => {
  return (
    <input
      aria-label={ariaLabel}
      className="block w-full rounded-md border p-3 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isDisabled}
      id={id}
      onChange={(event) => onValueChange && onValueChange(event.target.value)}
      placeholder={placeholder}
      readOnly={isReadonly}
      required={isRequired}
      type={type}
      value={value}
    />
  );
};
