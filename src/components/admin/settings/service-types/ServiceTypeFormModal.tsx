"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/global/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  durationMin: z.number().min(1, "La duración es obligatoria"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  tags: z.array(z.string()).optional(),
});

type ServiceTypeFormData = z.infer<typeof schema>;

interface ServiceType {
  id: number;
  slug: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  tags: string[];
  img: {
    id: number;
    previewUrl: string;
    originalUrl: string;
  };
}

interface ServiceTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  _token: string;
  onSuccess: () => void;
  defaultValues?: ServiceTypeFormData | null;
}

export default function ServiceTypeFormModal({
  isOpen,
  onClose,
  _token,
  onSuccess,
  defaultValues,
}: ServiceTypeFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceTypeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      durationMin: defaultValues?.durationMin || 30,
      price: defaultValues?.price || 0,
      tags: defaultValues?.tags || [],
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        description: defaultValues.description,
        durationMin: defaultValues.durationMin,
        price: defaultValues.price,
        tags: defaultValues.tags,
      });
    } else {
      reset({
        name: "",
        description: "",
        durationMin: 30,
        price: 0,
        tags: [],
      });
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: ServiceTypeFormData) => {
    try {
      if (defaultValues) {
        // TODO: Implementar la llamada a la API para actualizar el tipo de servicio
        // await updateServiceType(defaultValues.id, data, _token);
        toast("success", "Tipo de servicio actualizado correctamente");
      } else {
        // TODO: Implementar la llamada a la API para crear el tipo de servicio
        // await createServiceType(data, _token);
        toast("success", "Tipo de servicio creado correctamente");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast("error", "Error al guardar el tipo de servicio");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultValues ? "Editar Tipo de Servicio" : "Crear Tipo de Servicio"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1 py-2">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Input id="description" {...register("description")} />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="durationMin">Duración (minutos)</Label>
            <Input 
              id="durationMin" 
              type="number" 
              {...register("durationMin", { valueAsNumber: true })} 
            />
            {errors.durationMin && (
              <p className="text-sm text-red-600 mt-1">{errors.durationMin.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Precio</Label>
            <Input 
              id="price" 
              type="number" 
              step="0.01"
              {...register("price", { valueAsNumber: true })} 
            />
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {defaultValues ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 