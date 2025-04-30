// hooks/service-types/useServiceTypeForm.ts
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Esquema de validación
export const serviceTypeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  durationMin: z.number().min(1, "La duración es obligatoria"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  tags: z.array(z.string()).optional(),
});

export type ServiceTypeFormData = z.infer<typeof serviceTypeSchema>;

export const useServiceTypeCreate = (initialData?: Partial<ServiceTypeFormData>) => {
  return useForm<ServiceTypeFormData>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      durationMin: initialData?.durationMin ?? 30,
      price: initialData?.price ?? 0,
      tags: initialData?.tags ?? [],
    },
  });
};
