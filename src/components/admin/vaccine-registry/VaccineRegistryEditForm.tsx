"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateVaccineRegistry } from "@/lib/vaccine-registry/updateVaccineRegistry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/global/FormInput";
import SearchableSelect from "@/components/global/SearchableSelect";
import { blockExtraKeysNumber } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { Modal } from "@/components/global/Modal";

import {
  useVaccineRegistryEditForm,
  VaccineRegistryFormValues,
} from "@/hooks/vaccine-registry/useVaccineRegistryEditForm";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { Loader2 } from "lucide-react";

interface Props {
  token: string;
  initialData: VaccineRecord;
  clientId: number;
  petId: number;
}

export default function VaccineRegistryEditForm({
  token,
  initialData,
  clientId,
  petId,
}: Props) {
  const router = useRouter();

  const {
    form,
    pets,
    loading,
    vaccines,
    petSearch,
    setPetSearch,
    vaccineSearch,
    setVaccineSearch,
    isLoadingPets,
    setSelectedPetId,
    isLoadingVaccines,
    selectedPetId,
    hasSelectedPet,
    setHasSelectedVaccine,
    handlePetInputChange,
    handleVaccineInputChange,
    setHasSelectedPet,
  } = useVaccineRegistryEditForm(token, initialData, clientId, petId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const [pendingSubmit, setPendingSubmit] =
    useState<VaccineRegistryFormValues | null>(null);
  const [showNightWarning, setShowNightWarning] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const isNightHour = (dateStr?: string): boolean => {
    if (!dateStr) return false;
    const hour = new Date(dateStr).getHours();
    return hour < 6 || hour >= 19;
  };

  const submitData = async (data: VaccineRegistryFormValues) => {
    if (!data.vaccineId || !data.petId || !data.clientId) {
      toast("error", "Todos los campos deben estar completos");
      return;
    }

    try {
      const payload = {
        vaccineId: data.vaccineId,
        petId: data.petId,
        dose: data.dose,
        applicationDate: new Date(data.applicationDate).toISOString(),
        expectedDate: new Date(data.expectedDate).toISOString(),
      };
      await updateVaccineRegistry(token, initialData.id, payload);
      toast("success", "Registro actualizado correctamente");
      router.push(`/dashboard/clients/${data.clientId}/pet/${data.petId}`);
    } catch {
      toast("error", "Error al actualizar el registro");
    }
  };

  const onSubmit = async (data: VaccineRegistryFormValues) => {
    if (isNightHour(data.expectedDate) || isNightHour(data.applicationDate)) {
      setPendingSubmit(data);
      setShowNightWarning(true);
    } else {
      await submitData(data);
    }
  };

  const handleConfirmNightTime = async () => {
    if (!pendingSubmit) return;
    setIsConfirming(true);
    await submitData(pendingSubmit);
    setPendingSubmit(null);
    setShowNightWarning(false);
    setIsConfirming(false);
  };

  if (loading) {
    return (
      <div className="text-center my-16 w-full h-full flex justify-center items-center text-gray-700 ">
        <Loader2 className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <SearchableSelect
          label="Mascota"
          value={petSearch}
          options={pets}
          isLoading={isLoadingPets}
          onChangeSearch={handlePetInputChange}
          onSelect={(v) => {
            setValue("petId", v.id);
            setSelectedPetId(v.id);
            setPetSearch(v.label);
            setHasSelectedPet(true);
          }}
          noOptionsMessage="No se encontraron mascotas que coincidan con la búsqueda. Pruebe con otro campo..."
        />

        {errors.petId && (
          <p className="text-red-500 text-sm">{errors.petId.message}</p>
        )}

        {hasSelectedPet && selectedPetId && (
          <>
            <SearchableSelect
              label="Vacuna"
              value={vaccineSearch}
              options={vaccines}
              isLoading={isLoadingVaccines}
              onChangeSearch={handleVaccineInputChange}
              onSelect={(v) => {
                setValue("vaccineId", v.id);
                setVaccineSearch(v.label);
                setHasSelectedVaccine(true);
              }}
              noOptionsMessage="No se encontraron vacunas que coincidan con la búsqueda.  Pruebe con otro campo..."
            />

            {errors.vaccineId && (
              <p className="text-red-500 text-sm">{errors.vaccineId.message}</p>
            )}

            <FormInput
              id="dose"
              label="Dosis (ml)"
              type="number"
              step="any"
              min="0"
              register={register("dose")}
              error={errors.dose?.message}
              onKeyDown={blockExtraKeysNumber}
              name="dose"
            />

            <div>
              <label className="block text-sm font-medium">
                Fecha de aplicación
              </label>
              <Input type="datetime-local" {...register("applicationDate")} />
              {errors.applicationDate && (
                <p className="text-red-500 text-sm">
                  {errors.applicationDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Próxima aplicación
              </label>
              <Input type="datetime-local" {...register("expectedDate")} />
              {errors.expectedDate && (
                <p className="text-red-500 text-sm">
                  {errors.expectedDate.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </>
        )}
      </form>

      {showNightWarning && (
        <Modal
          isOpen={showNightWarning}
          onClose={() => !isConfirming && setShowNightWarning(false)}
          title="Confirmar horario nocturno"
          size="sm"
        >
          <p className="text-sm mb-4">
            ¿Está seguro de que el horario ingresado es correcto?
            <br />
            <span className="text-xs text-gray-600">
              Obs: Este horario se encuentra dentro del rango de urgencias
              nocturnas.
            </span>
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNightWarning(false)}
              disabled={isConfirming}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmNightTime} disabled={isConfirming}>
              {isConfirming ? "Procesando..." : "Confirmar y continuar"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
