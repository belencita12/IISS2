"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AUTH_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
import { validatePhoneNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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

  const [errors, setErrors] = useState<Partial<IFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: Partial<IFormData> = {};

    if (!formData.name) newErrors.name = "Ingrese un nombre válido";
    if (!formData.lastname) newErrors.lastname = "Ingrese un apellido válido";
    if (!formData.email) newErrors.email = "Ingrese un email válido. Ej: juanperez@gmail.com";
    if (!formData.password) newErrors.password = "Ingrese una contraseña válida";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Ingrese una contraseña válida";
    if (!formData.phoneNumber || !validatePhoneNumber(formData.phoneNumber)) newErrors.phoneNumber = "Ingrese un número de teléfono válido. Ej: +595985405811";
    if (!formData.ruc) newErrors.ruc = "Ingrese un RUC";
    if (!formData.address || formData.address.length < 10) newErrors.address = "Ingrese una dirección válida.Ej: Av. España 1234, Asunción, Paraguay";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (formData.password.length < 8) newErrors.password = "Debe tener al menos 8 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${AUTH_API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name + " " + formData.lastname,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          ruc: formData.ruc,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md my-10">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Registro</h1>
      <p className="text-sm text-gray-600 text-center mb-6">Complete el formulario para crear una nueva cuenta</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className={errors.name ? "border-red-500" : ""} />
          <Input name="lastname" placeholder="Apellido" value={formData.lastname} onChange={handleChange} className={errors.lastname ? "border-red-500" : ""} />
        </div>
        <div className="grid grid-cols-2 gap-4">
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
        </div>
        <Input name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className={errors.email ? "border-red-500" : ""} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <Input name="address" placeholder="Dirección" value={formData.address} onChange={handleChange} className={errors.address ? "border-red-500" : ""} />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        <div className="grid grid-cols-2 gap-4">
          <Input name="phoneNumber" placeholder="Número de teléfono" value={formData.phoneNumber} onChange={handleChange} className={errors.phoneNumber ? "border-red-500" : ""} />
          <Input name="ruc" placeholder="RUC" value={formData.ruc} onChange={handleChange} className={errors.ruc ? "border-red-500" : ""} />
        </div>
        <div className="grid grid-cols-2 gap-4">
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
        {errors.ruc && <p className="text-red-500 text-sm">{errors.ruc}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className={errors.password ? "border-red-500" : ""} />
          <Input name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "border-red-500" : ""} />
        </div>
        <div className="grid grid-cols-2 gap-4">
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" asChild>
            <Link href="/login">Tengo una cuenta</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? "Registrando..." : "Registrarme"}</Button>
        </div>
      </form>
    </div>
  );
}
