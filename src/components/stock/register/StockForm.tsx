"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerStock } from "@/lib/stock/registerStock";
import { useRouter } from "next/navigation";

const stockFormSchema = z.object({
  name: z.string().min(1, "El nombre del stock es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

interface StockFormProps {
  token: string;
}

export default function StockForm({ token }: StockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const onSubmit = async (data: StockFormValues) => {
   setIsSubmitting(true);
    try {
        await registerStock({ name: data.name, address: data.address }, token);
        toast.success("Depósito registrado con éxito");
      //  router.push("/dashboard/stock");
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" 
     //   "message" in (error as any).response.data
      ) {
        const errorMessage = (error as any).response.data.message;
        
        if (typeof errorMessage === "string") {
          if (errorMessage.includes("Uno o más campos ya están en uso")) {
            toast.error("El nombre del stock ya está registrado. Intente con otro.");
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Hubo un error al registrar el stock");
        }
      } else {
        toast.error("Hubo un error desconocido al registrar el stock");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Registro de Depósito</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>Nombre</Label>
          <Input {...register("name")} placeholder="Ingrese el nombre del depósito" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Dirección</Label>
          <Input {...register("address")} placeholder="Ingrese la dirección del depósito" />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/stock")}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registrando..." : "Registrar"}</Button>
        </div>
      </form>
    </div>
  );
}
