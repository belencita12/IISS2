'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  const m = useTranslations("ManufacturerTable");
  const b = useTranslations("Button");
  const ph= useTranslations("Placeholder");
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
        ? `${API_BASE_URL}/vaccine-manufacturer/${initialData.id}`
        : `${API_BASE_URL}/vaccine-manufacturer`;
      const method = initialData?.id ? "PATCH" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Error: La API devolvió una respuesta no válida (posible HTML en lugar de JSON)"
        );
      }
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          `Error: ${response.status} - ${
            responseData.message || "No se pudo guardar"
          }`
        );
      }
  
      // Al tener éxito, verifica si hay historial para retroceder
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/dashboard/vaccine/manufacturer");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md p-6 border rounded-lg shadow-md bg-white">
      <div className="text-left space-y-2">
        <label className="block text-sm font-medium">{m("name")}</label>
        <Input {...register("name")} placeholder={ph("name")} className="p-2 border rounded-md w-full" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <div className="flex space-x-4">
        <Button type="submit" disabled={loading} className="px-4 py-2">
          {loading ? b("saving") : initialData?.id ? b("save") : b("add")}
        </Button>
        <Button type="button" disabled={loading} onClick={() => router.back()} className="px-4 py-2 bg-gray-500 hover:bg-gray-600">
          {b("cancel")}
        </Button>
      </div>
    </form>
  );
}
