import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "@/lib/provider/IProvider";
import { phoneNumber, ruc } from "@/lib/schemas";

// Schema de validación con Zod
export const providerSchema = z.object({
  businessName: z.string().min(1, "El nombre o razón social es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  phoneNumber: phoneNumber(),
  ruc: ruc(),
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
