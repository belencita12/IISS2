"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  selectedClientId,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    form,
    clientSearch,
    setClientSearch,
    clients,
    isLoadingClients,
    onClientSelect,
    petLabels,
    isLoadingPets,
    selectedPetId,
    setSelectedPetId,
    vaccineSearch,
    setVaccineSearch,
    vaccineOptions,
    isLoadingVaccines,
    setHasSelectedVaccine,
    petSearch,
    setPetSearch,
    clearSelectedClient,
  } = useVaccineRegistryCreateForm(token, selectedClientId);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (selectedClientId) {
      setValue("clientId", selectedClientId);
    }
    if (petId) {
      setValue("petId", petId);
      setSelectedPetId(petId);
    }
  }, [selectedClientId, petId, setValue, setSelectedPetId]);

  const onSubmit = async (data: VaccineRegistryFormValues) => {
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
      router.back();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ocurrió un error";
      toast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clientSelected = !!(selectedClientId || getValues("clientId"));

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nuevo Registro de Vacunación</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <SearchableSelect
            label="Cliente"
            placeholder="Buscar por nombre o cédula..."
            value={clientSearch}
            options={clients.map((c) => ({
              id: c.id,
              label: `${c.fullName} - ${c.ruc}`,
            }))}
            isLoading={isLoadingClients}
            onChangeSearch={(val) => {
              setClientSearch(val);
              if (val.trim() === "") {
                if (val.trim() === "") {
                  clearSelectedClient();
                }
              }
            }}
            
            onSelect={(option) => {
              const fullClient = clients.find((c) => c.id === option.id);
              if (fullClient) onClientSelect(fullClient);
            }}
            disabled={!!selectedClientId}
          />

          {errors.clientId && (
            <p className="text-red-500 text-sm">{errors.clientId.message}</p>
          )}
        </div>

        {clientSelected && (
          <>
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
                onChangeSearch={setPetSearch}
                onSelect={(pet) => {
                  setValue("petId", pet.id);
                  setSelectedPetId(pet.id);
                  setPetSearch(pet.label);
                }}
              />
              {errors.petId && (
                <p className="text-red-500 text-sm">{errors.petId.message}</p>
              )}
            </div>

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
                onChangeSearch={(val) => {
                  setVaccineSearch(val);
                  setHasSelectedVaccine(false);
                }}
                onSelect={(vaccine) => {
                  setValue("vaccineId", vaccine.id);
                  setVaccineSearch(vaccine.label);
                  setHasSelectedVaccine(true);
                }}
                disabled={!selectedPetId}
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
                {isSubmitting ? "Creando..." : "Crear"}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
