"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { AUTH_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
import { RegisterFormSchema, RegisterForm } from "@/components/register/RegisterForm";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof RegisterFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${AUTH_API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `${data.name} ${data.lastname}`,
          email: data.email,
          password: data.password,
          adress: data.address,
          phoneNumber: data.phoneNumber,
          ruc: data.ruc,
        }),
      });

      if (!response.ok) {
        toast("error", "Error al registrarse.");
        return;
      }

      toast("success", "Registro exitoso. Redirigiendo...");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast("error", "Error de conexión. Inténtalo nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md my-10">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Registro</h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        Complete el formulario para crear una nueva cuenta
      </p>
      
      <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}