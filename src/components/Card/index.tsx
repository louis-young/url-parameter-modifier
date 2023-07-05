import type { ReactNode } from "react";

import classNames from "classnames";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={classNames("rounded-md border bg-lightest p-6", className)}>
      {children}
    </div>
  );
};
