type Size = "large" | "medium" | "small";

interface SpacerProps {
  size?: Size;
}

const variants: Record<Size, string> = {
  large: "h-10",
  medium: "h-6",
  small: "h-3",
};

export const Spacer = ({ size = "medium" }: SpacerProps) => {
  return <div className={variants[size]} />;
};
