"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { phoneNumber, ruc } from "@/lib/schemas";
import { signup } from "@/lib/auth/signup";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import FormInput from "../global/FormInput";
// Define the schema for registration
export const RegisterFormSchema = z
  .object({
    name: z.string().min(1, "Ingrese un nombre válido"),
    lastname: z.string().min(1, "Ingrese un apellido válido"),
    email: z.string().email("Ingrese un email válido. Ej: juanperez@gmail.com"),
    password: z.string().min(8, "Debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Ingrese una contraseña válida"),
    address: z
      .string()
      .min(
        10,
        "Ingrese una dirección válida. Ej: Av. España 1234, Asunción, Paraguay"
      ),
    phoneNumber: phoneNumber(),
    ruc: ruc(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onChange",
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await signup(data);
      toast("success", "Registro exitoso");
      router.push("/login");
    } catch (error) {
      toast("error", (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre y apellido */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          register={register("name")}
          error={errors.name?.message}
          placeholder="Nombre"
          name="name"
        />
        <FormInput
          register={register("lastname")}
          error={errors.lastname?.message}
          placeholder="Apellido"
          name="lastname"
        />
      </div>

      {/* Email */}
      <FormInput
        register={register("email")}
        error={errors.email?.message}
        placeholder="Correo electrónico"
        name="email"
      />

      {/* Dirección */}
      <FormInput
        register={register("address")}
        error={errors.address?.message}
        placeholder="Dirección"
        name="address"
      />

      {/* Teléfono y RUC */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          register={register("phoneNumber")}
          error={errors.phoneNumber?.message}
          placeholder="Número de teléfono"
          name="phoneNumber"
        />
        <FormInput
          register={register("ruc")}
          error={errors.ruc?.message}
          placeholder="RUC"
          name="ruc"
        />
      </div>

      {/* Contraseñas */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          register={register("password")}
          error={errors.password?.message}
          placeholder="Contraseña"
          name="password"
          type="password"
        />
        <FormInput
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          placeholder="Confirmar contraseña"
          name="confirmPassword"
          type="password"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" asChild>
          <Link href="/login">Tengo una cuenta</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrarme"}
        </Button>
      </div>
    </form>
  );
}
