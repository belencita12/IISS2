"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { registerStock } from "@/lib/stock/registerStock";
import { useRouter } from "next/navigation";
import { setStock } from "@/lib/stock/setStock";
import { StockData } from "@/lib/stock/IStock";
import {Modal} from "@/components/global/Modal"

const stockFormSchema = z.object({
  name: z.string().min(1, "El nombre del stock es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

interface StockFormProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: () => void;
  initialData?: StockData | null;
}

export const StockForm = ({ token, isOpen, onClose, onRegisterSuccess, initialData}: StockFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
  });

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("address", initialData.address);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: StockFormValues) => {
    setIsSubmitting(true);
    try {
      if(initialData?.id) {
        await setStock({id:initialData.id, ...data}, token);
        toast("success", "Depósito actualizado con éxito ✅");
      } else {
        await registerStock({ name: data.name, address:data.address}, token);
        toast("success", "Depósito registrado con éxito ✅");
      }
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast("error", error.message);
      } else {
        toast("error", "Error inesperado al registrar el depósito");
      }
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
  isOpen={isOpen}
  onClose={onClose}
  title={initialData ? "Editar Depósito" : "Registro de Depósito"}
  size="md"
>
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
      <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 
          initialData ?
            "Guardando..." :
            "Registrando..." :
          initialData ?
            "Guardar cambios" :
            "Registrar"}
      </Button>
    </div>
  </form>
</Modal>

  );
};