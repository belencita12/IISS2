"use client";

import { Provider } from "@/lib/provider/IProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { useState } from "react";
import { updateProvider } from "@/lib/provider/updateProvider";
import { createProvider } from "@/lib/provider/createProvider";
import { useProviderForm, ProviderFormValues } from "@/hooks/provider/useProviderForm";


interface Props {
  token: string;
  initialData?: Provider; // Si viene, estamos editando
}

export default function ProviderForm({ token, initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useProviderForm(initialData);
  

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ProviderFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        await updateProvider(token, initialData.id, data);
        toast("success", "Proveedor actualizado");
      } else {
        await createProvider(token, data);
        toast("success", "Proveedor creado");
      }
      router.push("/dashboard/settings/providers");
    } catch (err) {
      console.error(err);
      toast("error", "Ocurrió un error al guardar el proveedor");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Proveedor" : "Nuevo Proveedor"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Razón Social</label>
          <Input {...register("businessName")} placeholder="Ej: Tech Supplies Inc." />
          {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Descripción</label>
          <Input {...register("description")} placeholder="Ej: Proveedor de equipos tecnológicos" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Teléfono</label>
          <Input {...register("phoneNumber")} placeholder="Ej: +595 971 234567" />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">RUC</label>
          <Input {...register("ruc")} placeholder="Ej: 1234567-1" />
          {errors.ruc && <p className="text-red-500 text-sm">{errors.ruc.message}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" disabled={isSubmitting} variant="outline" onClick={() => router.push("/dashboard/settings/providers")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEdit ? "Guardando..." : "Creando...") : isEdit ? "Guardar cambios" : "Crear"}
          </Button>
        </div>
      </form>
    </div>
  );
}
