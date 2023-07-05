import type { ReactNode } from "react";

import classNames from "classnames";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
  children: ReactNode;
  headingLevel: HeadingLevel;
}

const variants: Record<HeadingLevel, string> = {
  h1: "text-4xl",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "text-lg",
  h5: "text-md",
  h6: "text-md",
};

export const Heading = ({ children, headingLevel }: HeadingProps) => {
  const Heading = headingLevel;

  return (
    <Heading className={classNames("font-semibold", variants[headingLevel])}>
      {children}
    </Heading>
  );
};
