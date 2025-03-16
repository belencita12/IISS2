"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/global/ValidatedInput";
import { registerClient } from "@/lib/admin/client/registerClient";
import { toast } from "@/lib/toast";

interface IFormData {
  name: string;
  lastname: string;
  email: string;
}

interface RegisterClientFormProps {
  token: string;
}

export default function RegisterClientForm({ token }: RegisterClientFormProps) {
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    lastname: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullName = `${formData.name.trim()} ${formData.lastname.trim()}`;
      const response = await registerClient({ fullName, email: formData.email }, token);

      if (response.status === 401) {
        toast("error", "El enlace de reseteo de contraseña ya fue utilizado. Redirigiendo...");
        setTimeout(() => router.push("/dashboard/clients"), 6000);
      } else if (response.error) {
        toast("error", response.error);
        setTimeout(() => router.push("/dashboard/clients"), 6000);
      } else {
        toast("success", "Usuario creado con éxito. Se ha enviado un correo para restablecer la contraseña.");
        setTimeout(() => router.push("/dashboard/clients"), 2000);
      }
    } catch (err: unknown) {
      toast(
        "error",
        err instanceof Error
          ? err.message
          : "Ocurrió un error. Redirigiendo..."
      );
      setTimeout(() => router.push("/dashboard/clients"), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="mt-8 ml-24 max-w-md p-6 text-left">
      <h1 className="text-3xl font-bold mb-6">Registrar Cliente</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label>Nombre</label>
        <ValidatedInput
          type="text"
          name="name"
          placeholder="Ingrese el nombre del cliente"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Apellido</label>
        <ValidatedInput
          type="text"
          name="lastname"
          placeholder="Ingrese el apellido del cliente"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <ValidatedInput
          type="email"
          name="email"
          placeholder="ejemplo@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="flex w-full gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/clients")}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Registrando..." : "Agregar cliente"}
          </Button>
        </div>
      </form>
    </div>
  );
}
