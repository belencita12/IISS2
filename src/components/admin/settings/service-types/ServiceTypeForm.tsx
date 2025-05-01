"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import FormImgUploader from "@/components/global/FormImgUploader";
import { createServiceType } from "@/lib/service-types/service";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getAllTags } from "@/lib/tags/service";
import { Tag } from "@/lib/tags/types";
import { TagFilter } from "@/components/admin/product/filter/TagFilter";

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
  price: z.coerce.number()
    .min(1, "El precio es obligatorio y debe ser al menos 1")
    .refine((val) => val >= 1, {
      message: "El precio debe ser al menos 1"
    }),
  cost: z.coerce.number()
    .min(1, "El costo es obligatorio y debe ser al menos 1")
    .refine((val) => val >= 1, {
      message: "El costo debe ser al menos 1"
    }),
  maxColabs: z.coerce.number()
    .min(0, "El número máximo de colaboradores no puede ser negativo")
    .optional(),
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
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await getAllTags(token);
        setAvailableTags(response.data);
      } catch (error) {
        console.error("Error al cargar tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    loadTags();
  }, [token]);

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

  const handleImageChange = (file?: File) => {
    setValue("img", file);
  };

  const handleTagsChange = (selectedTags: string[]) => {
    setTags(selectedTags);
    setValue("tags", selectedTags, { shouldValidate: true });
  };

  const onSubmit = async (data: ServiceTypeFormValues) => {
    try {
      const formData = new FormData();
      
      // Campos obligatorios (*)
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
      
      // Enviar tags como array
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", data.tags.join(","));
      }
      
      if (data.img) formData.append("img", data.img);

      console.log("Enviando datos:", {
        slug: data.slug,
        name: data.name,
        description: data.description,
        durationMin: data.durationMin,
        iva: data.iva,
        price: data.price,
        cost: data.cost,
        maxColabs: data.maxColabs,
        isPublic: data.isPublic,
        tags: data.tags,
      });

      await createServiceType(token, formData);
      toast("success", "Tipo de servicio creado con éxito", {
        duration: 2000,
        onAutoClose: () => router.push("/dashboard/settings/service-types"),
        onDismiss: () => router.push("/dashboard/settings/service-types"),
      });
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1" noValidate>
          <div>
            <Label>Nombre</Label>
            <Input
              {...register("name")}
              placeholder="Ingrese el nombre del servicio"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              {...register("slug")}
              placeholder="servicio-veterinario"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              {...register("description")}
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Duración (minutos)</Label>
              <Input
                type="number"
                {...register("durationMin")}
                step="5"
                min="5"
              />
              {errors.durationMin && (
                <p className="text-red-500 text-sm mt-1">{errors.durationMin.message}</p>
              )}
            </div>

            <div>
              <Label>Precio</Label>
              <Input
                type="number"
                {...register("price")}
                min="1"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label>IVA (%)</Label>
              <Input
                type="number"
                {...register("iva")}
                min="1"
                max="100"
              />
              {errors.iva && (
                <p className="text-red-500 text-sm mt-1">{errors.iva.message}</p>
              )}
            </div>

            <div>
              <Label>Costo</Label>
              <Input
                type="number"
                {...register("cost")}
                min="1"
              />
              {errors.cost && (
                <p className="text-red-500 text-sm mt-1">{errors.cost.message}</p>
              )}
            </div>

            <div>
              <Label>MaxColabs (opcional)</Label>
              <Input
                type="number"
                {...register("maxColabs")}
                min="0"
              />
              {errors.maxColabs && (
                <p className="text-red-500 text-sm mt-1">{errors.maxColabs.message}</p>
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

          <div>
            <Label>Tags</Label>
            <TagFilter
              token={token}
              selectedTags={tags}
              onChange={handleTagsChange}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleTagsChange(tags.filter(t => t !== tag))}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
            )}
          </div>

          <div className="flex justify-start gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/settings/service-types")}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 