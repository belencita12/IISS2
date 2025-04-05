import { ComponentProps } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = ComponentProps<"input"> & {
  register: UseFormRegisterReturn;
  error?: string;
  label?: string;
  name: string;
};

const FormInput = ({
  register,
  error,
  label,
  name,
  ...props
}: FormInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-2">
        {label && <Label htmlFor={name}>{label}</Label>}
        <Input {...props} {...register} id={name} />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormInput;
