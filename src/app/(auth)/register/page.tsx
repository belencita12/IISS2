"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/global/ValidatedInput";
import { set } from "zod";

interface IFormData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phoneNumber: string;
  ruc: string;
}

const HARDCODED_LOGIN_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export default function RegisterForm() {
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
    ruc: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !formData.name ||
      !formData.lastname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.address ||
      !formData.phoneNumber ||
      !formData.ruc
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      setError("Ingrese un correo válido.");
      return;
    }
    

    if (formData.address.length < 10) {
      setError("Ingrese una dirección válida.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const response = await fetch(`${HARDCODED_LOGIN_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name.trim() + " " + formData.lastname.trim(),
          email: formData.email,
          password: formData.password,
          adress: formData.address,
          phoneNumber: formData.phoneNumber,
          ruc: formData.ruc,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Ocurrió un error al registrarse.");
        return;
      }

      setSuccess("Registro exitoso. Redirigiendo...");
      setFormData({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phoneNumber: "",
        ruc: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError("Error de conexión. Inténtalo nuevamente.");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="mt-[30px] mb-[50px] flex items-center justify-center px-4 sm:px-6 ">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-3xl mx-auto gap-x-8">
        <div className="w-full sm:w-1/2 text-center sm:text-left mb-6 sm:mb-0">
          <h1 className="text-2xl font-semibold text-black m-0">Registro</h1>
          <p className="text-sm text-gray-600 mt-2 mb-6">
            Crea una nueva cuenta
          </p>
        </div>
        <div className="w-full sm:w-1/2 max-w-[400px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <br />

            <div className="flex flex-col sm:flex-row gap-4">
              <ValidatedInput
                type="text"
                name="name"
                placeholder="Ingrese su nombre"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <ValidatedInput
                type="text"
                name="lastname"
                placeholder="Ingrese su apellido"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <ValidatedInput
                type="email"
                name="email"
                placeholder="Ingrese su correo"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <ValidatedInput
                type="text"
                name="address"
                placeholder="Ingrese su dirección"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ValidatedInput
                type="text"
                name="phoneNumber"
                placeholder="Ingrese su número de teléfono"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />

              <ValidatedInput
                type="text"
                name="ruc"
                placeholder="Ingrese su RUC"
                value={formData.ruc}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ValidatedInput
                type="password"
                name="password"
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <ValidatedInput
                type="password"
                name="confirmPassword"
                placeholder="Confirme su contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/login">Tengo una cuenta</Link>
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrarme"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
