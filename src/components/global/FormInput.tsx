import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  register: UseFormRegisterReturn;
  error?: string;
  label?: string;
  name: string;
};

const FormInput = ({ register, error, label, name }: FormInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input {...register} id={name} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormInput;
