import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
  type: HTMLButtonElement["type"];
}

export const Button = ({
  children,
  isDisabled = false,
  onClick,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      className="rounded-md bg-primary px-10 py-3 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
