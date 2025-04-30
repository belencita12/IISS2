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
import { createServiceType, updateServiceType } from "@/lib/service-types/service";

const serviceTypeFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z.string().min(1, "El slug es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  durationMin: z.coerce.number().min(1, "La duración es obligatoria"),
  iva: z.coerce.number().min(0, "El IVA no puede ser negativo"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  maxColabs: z.coerce.number().optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  img: image(),
});

type ServiceTypeFormValues = z.infer<typeof serviceTypeFormSchema>;

interface ServiceTypeFormProps {
  token: string;
  defaultValues?: ServiceTypeFormValues;
  id?: number;
}

export default function ServiceTypeForm({ token, defaultValues, id }: ServiceTypeFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(serviceTypeFormSchema),
    defaultValues: defaultValues || {
      name: "",
      slug: "",
      description: "",
      durationMin: 30,
      iva: 0,
      price: 0,
      maxColabs: 0,
      isPublic: false,
      tags: [],
      img: undefined,
    },
  });

  const handleImageChange = (file?: File) => {
    setValue("img", file);
  };

  const onSubmit = async (data: ServiceTypeFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "boolean" || typeof value === "number") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      });

      if (id) {
        await updateServiceType(token, id, formData);
        toast("success", "Tipo de servicio actualizado con éxito");
      } else {
        await createServiceType(token, formData);
        toast("success", "Tipo de servicio registrado con éxito");
      }
      router.push("/dashboard/settings/service-types");
    } catch (error) {
      toast("error", id ? "Error al actualizar el tipo de servicio" : "Error al registrar el tipo de servicio");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col pt-6 md:flex-row gap-8">
        <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
          <h1 className="text-2xl font-bold self-start">
            {id ? "Editar" : "Registro de"} Tipo de Servicio
          </h1>
          <p className="text-gray-600 self-start">
            {id ? "Modifica" : "Ingresa"} los datos del tipo de servicio
          </p>
          <div className="w-full">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">
              Imagen (Opcional)
            </h3>
            <FormImgUploader
              prevClassName="rounded"
              onChange={handleImageChange}
              //previewUrl={defaultValues?.img?.originalUrl}
            />
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
            <FormInput
              type="number"
              label="Duración (minutos)"
              name="durationMin"
              register={register("durationMin")}
              error={errors.durationMin?.message}
            />

            <FormInput
              type="number"
              label="IVA"
              name="iva"
              register={register("iva")}
              error={errors.iva?.message}
            />

            <FormInput
              type="number"
              label="Precio"
              name="price"
              register={register("price")}
              error={errors.price?.message}
            />

            <FormInput
              type="number"
              label="MaxColabs (opcional)"
              name="maxColabs"
              register={register("maxColabs")}
              error={errors.maxColabs?.message}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              {...register("isPublic")}
            />
            <Label htmlFor="isPublic">Público</Label>
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