"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createVaccineRegistry } from "@/lib/vaccine-registry/createVaccineRegistry";
import {
  VaccineRegistryFormValues,
  useVaccineRegistryCreateForm,
} from "@/hooks/vaccine-registry/useVaccineRegistryForm";
import SearchableSelect from "@/components/global/SearchableSelect";
import FormInput from "@/components/global/FormInput";
import { blockExtraKeysNumber } from "@/lib/utils";
import { Modal } from "@/components/global/Modal";

interface Props {
  token: string;
  petId?: number;
  selectedPetLabel?: string;
  selectedClientId?: number;
  selectedClientLabel?: string;
}

export default function VaccineRegistryForm({
  token,
  petId,
  selectedPetLabel,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNightWarning, setShowNightWarning] = useState(false);
  const [pendingSubmit, setPendingSubmit] =
    useState<VaccineRegistryFormValues | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    form,
    petLabels,
    isLoadingPets,
    pets,
    selectedPet,
    setSelectedPet,
    vaccineSearch,
    setVaccineSearch,
    vaccineOptions,
    isLoadingVaccines,
    setHasSelectedVaccine,
    petSearch,
    setPetSearch,
    handlePetInputChange,
    handleVaccineInputChange,
    setHasSelectedPet,
  } = useVaccineRegistryCreateForm(token);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const isNightHour = (dateStr?: string): boolean => {
    if (!dateStr) return false;
    const hour = new Date(dateStr).getHours();
    return hour < 6 || hour >= 19;
  };

  const handleConfirmNightTime = async () => {
    if (pendingSubmit) {
      setIsConfirming(true);
      await submitData(pendingSubmit);
      setPendingSubmit(null);
      setShowNightWarning(false);
      setIsConfirming(false);
    }
  };

  const submitData = async (data: VaccineRegistryFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        vaccineId: data.vaccineId,
        petId: data.petId!,
        dose: data.dose,
        applicationDate: new Date(data.applicationDate).toISOString(),
        expectedDate: new Date(data.expectedDate).toISOString(),
      };

      if (!payload.petId) {
        toast("error", "Debe seleccionar una mascota");
        return;
      }

      await createVaccineRegistry(payload, token);
      toast("success", "Registro creado con éxito");
      router.push(`/dashboard/clients/${data.clientId}/pet/${data.petId}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ocurrió un error";
      toast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedPet) setValue("clientId", selectedPet.owner.id);
    else setValue("clientId", undefined as unknown as number);
  }, [selectedPet, setValue]);

  const onSubmit = async (data: VaccineRegistryFormValues) => {
    if (isNightHour(data.expectedDate) || isNightHour(data.applicationDate)) {
      setPendingSubmit(data);
      setShowNightWarning(true);
    } else {
      await submitData(data);
    }
  };

  console.log(errors);
  const isPetSelected = !!watch("petId");

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nuevo Registro de Vacunación</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <SearchableSelect
            label="Mascota"
            placeholder="Buscar mascota..."
            value={
              petId
                ? selectedPetLabel ??
                  petLabels.find((p) => p.id === petId)?.label ??
                  ""
                : petSearch
            }
            options={petLabels}
            isLoading={isLoadingPets}
            disabled={!!petId}
            onChangeSearch={handlePetInputChange}
            onSelect={(pet) => {
              setSelectedPet(pets.find((p) => p.id === pet.id) || null);
              setValue("petId", pet.id);
              setPetSearch(pet.label);
              setHasSelectedPet(true);
            }}
            noOptionsMessage="No se encontraron mascotas que coincidan con la búsqueda. Pruebe de otra forma..."
          />
          {errors.petId && (
            <p className="text-red-500 text-sm">{errors.petId.message}</p>
          )}
        </div>
        {isPetSelected && (
          <>
            <div>
              <SearchableSelect
                label="Vacuna"
                placeholder="Buscar vacuna..."
                value={vaccineSearch}
                options={vaccineOptions.map((v) => ({
                  id: v.id,
                  label: `${v.name} (${v.manufacturer.name})`,
                }))}
                isLoading={isLoadingVaccines}
                onChangeSearch={handleVaccineInputChange}
                onSelect={(vaccine) => {
                  setValue("vaccineId", vaccine.id);
                  setVaccineSearch(vaccine.label);
                  setHasSelectedVaccine(true);
                }}
                disabled={!selectedPet}
                noOptionsMessage="No se encontraron vacunas que coincidan con la búsqueda. Pruebe de otra forma..."
              />
              {errors.vaccineId && (
                <p className="text-red-500 text-sm">
                  {errors.vaccineId.message}
                </p>
              )}
            </div>

            <div>
              <FormInput
                id="dose"
                type="number"
                step="any"
                min="0"
                onKeyDown={blockExtraKeysNumber}
                register={register("dose")}
                error={errors.dose?.message}
                label="Dosis (ml)"
                name="dose"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
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
              <label className="block mb-1 text-sm font-medium">
                Próxima aplicación esperada
              </label>
              <Input type="datetime-local" {...register("expectedDate")} />
              {errors.expectedDate && (
                <p className="text-red-500 text-sm">
                  {errors.expectedDate.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar"}
              </Button>
            </div>
          </>
        )}
      </form>

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
    </div>
  );
}
