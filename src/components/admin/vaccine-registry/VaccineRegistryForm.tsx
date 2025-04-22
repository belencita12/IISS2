"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vaccine, VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { createVaccineRegistry } from "@/lib/vaccine-registry/createVaccineRegistry";
import { updateVaccineRegistry } from "@/lib/vaccine-registry/updateVaccineRegistry";
import { useVaccineRegistryForm, VaccineRegistryFormValues } from "@/hooks/vaccine-registry/useVaccineRegistryForm";

interface Props {
  token: string;
  initialData?: VaccineRecord;
  petId: number;
  vaccineOptions: Vaccine[]; // opciones para el select
}

export default function VaccineRegistryForm({ token, initialData, petId, vaccineOptions }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useVaccineRegistryForm(initialData);

  const onSubmit = async (data: VaccineRegistryFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        petId,
      };

      if (isEdit && initialData?.id) {
        await updateVaccineRegistry(token, initialData.id, payload);
        toast("success", "Registro actualizado con éxito");
      } else {
        await createVaccineRegistry(payload, token);
        toast("success", "Registro creado con éxito");
      }

      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrió un error";
      toast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Registro de Vacunación" : "Nuevo Registro de Vacunación"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Select de vacuna */}
        <div>
          <label className="block mb-1 text-sm font-medium">Vacuna</label>
          <select {...register("vaccineId")} className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Selecciona una vacuna</option>
            {vaccineOptions.map((vaccine) => (
              <option key={vaccine.id} value={vaccine.id}>
                {vaccine.name} ({vaccine.manufacturer.name})
              </option>
            ))}
          </select>
          {errors.vaccineId && <p className="text-red-500 text-sm">{errors.vaccineId.message}</p>}
        </div>

        {/* Dosis */}
        <div>
          <label className="block mb-1 text-sm font-medium">Dosis</label>
          <Input type="number" {...register("dose")} />
          {errors.dose && <p className="text-red-500 text-sm">{errors.dose.message}</p>}
        </div>

        {/* Fecha de aplicación */}
        <div>
          <label className="block mb-1 text-sm font-medium">Fecha de aplicación</label>
          <Input type="datetime-local" {...register("applicationDate")} />
          {errors.applicationDate && <p className="text-red-500 text-sm">{errors.applicationDate.message}</p>}
        </div>

        {/* Fecha esperada */}
        <div>
          <label className="block mb-1 text-sm font-medium">Próxima aplicación esperada</label>
          <Input type="datetime-local" {...register("expectedDate")} />
          {errors.expectedDate && <p className="text-red-500 text-sm">{errors.expectedDate.message}</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => router.back()}>
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
