import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { UseFormRegisterReturn } from "react-hook-form";

type FormSelectProps = {
  onChange: (value: string) => void;
  options?: SelectOptions[];
  error?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  name: string;
  register: UseFormRegisterReturn;
};

export type SelectOptions = {
  value: string;
  label: string;
};

const FormSelect = ({
  onChange,
  options = [],
  error,
  label,
  id,
  disabled,
  placeholder,
}: FormSelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-2">
        {label && <Label>{label}</Label>}
        <Select disabled={disabled} onValueChange={onChange}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormSelect;
