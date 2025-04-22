"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vaccine, VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { createVaccineRegistry } from "@/lib/vaccine-registry/createVaccineRegistry";
import { updateVaccineRegistry } from "@/lib/vaccine-registry/updateVaccineRegistry";
import {
  useVaccineRegistryForm,
  VaccineRegistryFormValues,
} from "@/hooks/vaccine-registry/useVaccineRegistryForm";
import { PetData } from "@/lib/pets/IPet";

interface Props {
  token: string;
  initialData?: VaccineRecord;
  petId?: number;
  vaccineOptions: Vaccine[];
  petOptions?: PetData[];
}

export default function VaccineRegistryForm({
  token,
  initialData,
  petId,
  vaccineOptions,
  petOptions,
}: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    petLabels,
  } = useVaccineRegistryForm(initialData, petId, token, petOptions);

  const [petSearch, setPetSearch] = useState("");
  const [isPetListVisible, setIsPetListVisible] = useState(false);

  const [vaccineSearch, setVaccineSearch] = useState("");
  const [isVaccineListVisible, setIsVaccineListVisible] = useState(false);

  const filteredPets = petLabels.filter((pet) =>
    pet.label.toLowerCase().includes(petSearch.toLowerCase())
  );

  const filteredVaccines = vaccineOptions.filter((vaccine) =>
    vaccine.name.toLowerCase().includes(vaccineSearch.toLowerCase())
  );

  const onSubmit = async (data: VaccineRegistryFormValues) => {
    setIsSubmitting(true);
    try {
      if (!petId && !data.petId) {
        toast("error", "Debe seleccionar una mascota");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...data,
        petId: petId ?? data.petId!,
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
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Editar Registro de Vacunación" : "Nuevo Registro de Vacunación"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mascota con buscador */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Mascota</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar mascota..."
              value={
                petId
                  ? petLabels.find((p) => p.id === petId)?.label ?? ""
                  : petSearch
              }
              onChange={(e) => setPetSearch(e.target.value)}
              onFocus={() => setIsPetListVisible(true)}
              onBlur={() => setTimeout(() => setIsPetListVisible(false), 200)}
              disabled={!!petId}
            />
            {isPetListVisible && !petId && (
              <div className="absolute z-50 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                {filteredPets.map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => {
                      setValue("petId", pet.id);
                      setPetSearch(pet.label);
                      setIsPetListVisible(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {pet.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.petId && (
            <p className="text-red-500 text-sm">{errors.petId.message}</p>
          )}
        </div>

        {/* Vacuna con buscador */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Vacuna</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar vacuna..."
              value={vaccineSearch}
              onChange={(e) => setVaccineSearch(e.target.value)}
              onFocus={() => setIsVaccineListVisible(true)}
              onBlur={() => setTimeout(() => setIsVaccineListVisible(false), 200)}
            />
            {isVaccineListVisible && (
              <div className="absolute z-50 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                {filteredVaccines.map((vaccine) => (
                  <div
                    key={vaccine.id}
                    onClick={() => {
                      setValue("vaccineId", vaccine.id);
                      setVaccineSearch(`${vaccine.name} (${vaccine.manufacturer.name})`);
                      setIsVaccineListVisible(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {vaccine.name} ({vaccine.manufacturer.name})
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.vaccineId && (
            <p className="text-red-500 text-sm">{errors.vaccineId.message}</p>
          )}
        </div>

        {/* Dosis */}
        <div>
          <label className="block mb-1 text-sm font-medium">Dosis</label>
          <Input type="number" {...register("dose")} />
          {errors.dose && (
            <p className="text-red-500 text-sm">{errors.dose.message}</p>
          )}
        </div>

        {/* Fechas */}
        <div>
          <label className="block mb-1 text-sm font-medium">Fecha de aplicación</label>
          <Input type="datetime-local" {...register("applicationDate")} />
          {errors.applicationDate && (
            <p className="text-red-500 text-sm">{errors.applicationDate.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Próxima aplicación esperada</label>
          <Input type="datetime-local" {...register("expectedDate")} />
          {errors.expectedDate && (
            <p className="text-red-500 text-sm">{errors.expectedDate.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? "Guardando..."
                : "Creando..."
              : isEdit
              ? "Guardar cambios"
              : "Crear"}
          </Button>
        </div>
      </form>
    </div>
  );
}
