"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import FormInput from "@/components/global/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import FormImgUploader from "@/components/global/FormImgUploader";
import { image } from "@/lib/schemas";
import { createServiceType } from "@/lib/service-types/service";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const serviceTypeFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z.string().min(1, "El slug es obligatorio"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  durationMin: z.coerce.number()
    .min(1, "La duración es obligatoria")
    .refine((val) => val % 5 === 0, {
      message: "La duración debe ser múltiplo de 5"
    }),
  iva: z.coerce.number()
    .min(0, "El IVA no puede ser negativo")
    .max(100, "El IVA no puede ser mayor a 100"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo"),
  maxColabs: z.coerce.number().optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  img: z.instanceof(File).optional(),
});

type ServiceTypeFormValues = z.infer<typeof serviceTypeFormSchema>;

interface ServiceTypeFormProps {
  token: string;
}

export default function ServiceTypeForm({ token }: ServiceTypeFormProps) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(serviceTypeFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      durationMin: 30,
      iva: 5,
      price: 0,
      cost: 0,
      maxColabs: 1,
      isPublic: false,
      tags: [],
      img: undefined,
    },
  });

  const price = watch("price");
  const iva = watch("iva");
  const tags = watch("tags") || [];

  const handleImageChange = (file?: File) => {
    setValue("img", file);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: ServiceTypeFormValues) => {
    try {
      const formData = new FormData();
      
      // Campos obligatorios
      formData.append("slug", data.slug);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("durationMin", data.durationMin.toString());
      formData.append("iva", data.iva.toString());
      formData.append("price", data.price.toString());
      formData.append("cost", data.cost.toString());
      
      // Campos opcionales
      if (data.maxColabs) formData.append("maxColabs", data.maxColabs.toString());
      if (data.isPublic !== undefined) formData.append("isPublic", data.isPublic.toString());
      if (data.tags && data.tags.length > 0) formData.append("tags", JSON.stringify(data.tags));
      if (data.img) formData.append("img", data.img);

      await createServiceType(token, formData);
      toast("success", "Tipo de servicio registrado con éxito");
      router.push("/dashboard/settings/service-types");
    } catch (error: any) {
      console.error("Error al crear el tipo de servicio:", error);
      if (error.message?.includes("ya están en uso")) {
        toast("error", "El nombre o slug del servicio ya está en uso. Por favor, elige otros valores.");
      } else {
        toast("error", "Error al registrar el tipo de servicio");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col pt-6 md:flex-row gap-8">
        <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
          <h1 className="text-2xl font-bold self-start">
            Registro de Tipo de Servicio
          </h1>
          <p className="text-gray-600 self-start">
            Ingresa los datos del tipo de servicio
          </p>
          <div className="w-full">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">
              Imagen (Opcional)
            </h3>
            <div className="w-full aspect-square max-w-[250px] mx-auto">
              <FormImgUploader
                prevClassName="rounded-lg w-full h-full object-cover"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
          <FormInput
            label="Nombre"
            name="name"
            register={register("name")}
            error={errors.name?.message}
          />

          <FormInput
            label="Slug"
            name="slug"
            register={register("slug")}
            error={errors.slug?.message}
            placeholder="servicio-veterinario"
          />

          <div>
            <Label>Descripción</Label>
            <Textarea
              {...register("description")}
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duración (minutos)</Label>
              <Input
                type="number"
                {...register("durationMin")}
                step="5"
                min="5"
              />
              {errors.durationMin && (
                <p className="text-sm text-red-600">{errors.durationMin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Precio</Label>
              <Input
                type="number"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>IVA (%)</Label>
              <Input
                type="number"
                {...register("iva")}
                min="1"
                max="100"
              />
              {errors.iva && (
                <p className="text-sm text-red-600">{errors.iva.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Costo</Label>
              <Input
                type="number"
                {...register("cost")}
              />
              {errors.cost && (
                <p className="text-sm text-red-600">{errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>MaxColabs (opcional)</Label>
              <Input
                type="number"
                {...register("maxColabs")}
              />
              {errors.maxColabs && (
                <p className="text-sm text-red-600">{errors.maxColabs.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              {...register("isPublic")}
            />
            <Label htmlFor="isPublic">Público</Label>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ingrese un tag y presione Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-start gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/settings/service-types")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 