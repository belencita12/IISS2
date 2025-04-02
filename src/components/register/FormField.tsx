import { Input } from "@/components/ui/input";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder: string;
  type?: string;
}

export function FormField({ register, error, placeholder, type = "text" }: FormFieldProps) {
  return (
    <div>
      <Input
        {...register}
        type={type}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}