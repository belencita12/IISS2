import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "@/lib/provider/IProvider";

// Schema de validación con Zod
export const providerSchema = z.object({
  businessName: z.string().min(1, "El nombre o razón social es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  phoneNumber: z
    .string()
    .min(13, "El número de teléfono es obligatorio")
    .regex(/^\+?[0-9\s\-()]{7,}$/, "Número inválido"),
  ruc: z
    .string()
    .min(5, "El RUC es obligatorio")
    .regex(/^\d{3,}-\d{1}$/, "RUC inválido, formato esperado: 1234567-1"),
});

export type ProviderFormValues = z.infer<typeof providerSchema>;

export const useProviderForm = (initialData?: Provider) => {
  return useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      businessName: initialData?.businessName ?? "",
      description: initialData?.description ?? "",
      phoneNumber: initialData?.phoneNumber ?? "",
      ruc: initialData?.ruc ?? "",
    },
  });
};
