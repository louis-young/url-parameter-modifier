import { type ComponentProps, useId } from "react";

import { Label } from "../Label";
import { TextInput } from "../TextInput";

export interface LabelledTextInputProps
  extends Omit<ComponentProps<typeof TextInput>, "ariaLabel" | "id"> {
  label: string;
}

export const LabelledTextInput = ({
  label,
  ...props
}: LabelledTextInputProps) => {
  const id = useId();

  return (
    <Label htmlFor={id} label={label}>
      <TextInput id={id} {...props} />
    </Label>
  );
};
