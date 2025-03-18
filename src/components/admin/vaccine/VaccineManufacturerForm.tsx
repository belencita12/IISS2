'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const vaccineManufacturerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 3 caracteres"),
});

type VaccineManufacturerFormProps = {
  initialData?: { id?: string; name: string };
};

export default function VaccineManufacturerForm({ initialData }: VaccineManufacturerFormProps) {
  const [loading, setLoading] = useState(false);
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
    try {
      const url = initialData?.id
        ? `/api/vaccine-manufacturer/${initialData.id}`
        : "/api/vaccine-manufacturer";
      const method = initialData?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al guardar");
      router.push("/dashboard/vaccine/manufacturer");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md p-6  rounded-lg  bg-white">
      <div className="text-left space-y-2">
        <label className="block text-sm font-medium">Nombre</label>
        <Input {...register("name")} placeholder="Nombre del fabricante" className="p-2 border rounded-md w-full" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>
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