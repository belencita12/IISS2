// hooks/vaccine-registry/useVaccineRegistryForm.ts

import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const vaccineRegistrySchema = z.object({
  vaccineId: z
    .number({ invalid_type_error: "Debe seleccionar una vacuna" })
    .min(1, "La vacuna es obligatoria"),
  dose: z
    .number({ invalid_type_error: "Debe ingresar un número" })
    .min(1, "La dosis es obligatoria"),
  applicationDate: z
    .string()
    .min(1, "La fecha de aplicación es obligatoria"),
  expectedDate: z
    .string()
    .min(1, "La fecha esperada es obligatoria"),
});

export type VaccineRegistryFormValues = z.infer<typeof vaccineRegistrySchema>;

export const useVaccineRegistryForm = (initialData?: VaccineRecord) => {
    return useForm<VaccineRegistryFormValues>({
      resolver: zodResolver(vaccineRegistrySchema),
      defaultValues: {
        vaccineId: initialData?.vaccineId || undefined,
        dose: initialData?.dose || 1,
        applicationDate: initialData?.applicationDate
          ? initialData.applicationDate.slice(0, 16)
          : "",
        expectedDate: initialData?.expectedDate
          ? initialData.expectedDate.slice(0, 16)
          : "",
      },
    });
  };
  