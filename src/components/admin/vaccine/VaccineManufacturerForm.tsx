'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const vaccineManufacturerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

type VaccineManufacturerFormProps = {
  initialData?: { id?: string; name: string };
  token: string;
};

export default function VaccineManufacturerForm({ initialData, token }: VaccineManufacturerFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vaccineManufacturerSchema),
    defaultValues: initialData || { name: "" },
  });

  const onSubmit = async (data: { name: string }) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const url = initialData?.id
        ? `/api/vaccine-manufacturer/${initialData.id}`
        : "/api/vaccine-manufacturer";
      const method = initialData?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response body:", responseData);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${responseData.message || "No se pudo guardar"}`);
      }

      router.push("/dashboard/vaccine/manufacturer");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md p-6 border rounded-lg shadow-md bg-white">
      <div className="text-left space-y-2">
        <label className="block text-sm font-medium">Nombre</label>
        <Input {...register("name")} placeholder="Nombre del fabricante" className="p-2 border rounded-md w-full" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <div className="flex space-x-4">
        <Button type="submit" disabled={loading} className="px-4 py-2">
          {loading ? "Guardando..." : initialData?.id ? "Actualizar" : "Crear"}
        </Button>
        <Button type="button" disabled={loading} onClick={() => router.back()} className="px-4 py-2 bg-gray-500 hover:bg-gray-600">
          Cancelar
        </Button>
      </div>
    </form>
  );
}