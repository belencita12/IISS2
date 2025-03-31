import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { phoneNumber, ruc } from "@/lib/schemas";
import { FormField } from "./FormField";

// Define the schema for registration
export const RegisterFormSchema = z.object({
  name: z.string().min(1, "Ingrese un nombre válido"),
  lastname: z.string().min(1, "Ingrese un apellido válido"),
  email: z.string().email("Ingrese un email válido. Ej: juanperez@gmail.com"),
  password: z.string().min(8, "Debe tener al menos 8 caracteres"),
  confirmPassword: z.string().min(1, "Ingrese una contraseña válida"),
  address: z.string().min(10, "Ingrese una dirección válida. Ej: Av. España 1234, Asunción, Paraguay"),
  phoneNumber: phoneNumber(),
  ruc: ruc(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => Promise<void>;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onChange"
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre y apellido */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          register={register("name")}
          error={errors.name}
          placeholder="Nombre"
        />
        <FormField
          register={register("lastname")}
          error={errors.lastname}
          placeholder="Apellido"
        />
      </div>

      {/* Email */}
      <FormField
        register={register("email")}
        error={errors.email}
        placeholder="Correo electrónico"
      />

      {/* Dirección */}
      <FormField
        register={register("address")}
        error={errors.address}
        placeholder="Dirección"
      />

      {/* Teléfono y RUC */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          register={register("phoneNumber")}
          error={errors.phoneNumber}
          placeholder="Número de teléfono"
        />
        <FormField
          register={register("ruc")}
          error={errors.ruc}
          placeholder="RUC"
        />
      </div>

      {/* Contraseñas */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          register={register("password")}
          error={errors.password}
          placeholder="Contraseña"
          type="password"
        />
        <FormField
          register={register("confirmPassword")}
          error={errors.confirmPassword}
          placeholder="Confirmar contraseña"
          type="password"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" asChild>
          <Link href="/login">Tengo una cuenta</Link>
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrarme"}
        </Button>
      </div>
    </form>
  );
}