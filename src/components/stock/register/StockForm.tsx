"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { registerStock } from "@/lib/stock/registerStock";
import { useRouter } from "next/navigation";

const stockFormSchema = z.object({
  name: z.string().min(1, "El nombre del stock es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

interface StockFormProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StockForm = ({ token, isOpen, onClose }: StockFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
  });

  const onSubmit = async (data: StockFormValues) => {
    setIsSubmitting(true);
    try {
      await registerStock({ name: data.name, address: data.address }, token);
      toast("success", "Depósito registrado con éxito"); 
      onClose();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const errorMessage = (error as { message: string }).message;          
        toast("error", errorMessage);
        return;
      }   
      toast("error", "Error inesperado al registrar el empleado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro de Depósito</DialogTitle>
        </DialogHeader>
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
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registrando..." : "Registrar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
