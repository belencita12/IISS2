"use client";

import { useRouter } from "next/navigation";

import { updateVaccineRegistry } from "@/lib/vaccine-registry/updateVaccineRegistry";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/global/FormInput";
import SearchableSelect from "@/components/global/SearchableSelect";
import { blockExtraKeysNumber } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { useVaccineRegistryEditForm, VaccineRegistryFormData } from "@/hooks/vaccine-registry/useVaccineRegistryEditForm";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";

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
    clients,
    pets,
    vaccines,
    loading,
    clientSearch,
    setClientSearch,
    petSearch,
    setPetSearch,
    vaccineSearch,
    setVaccineSearch,
  } = useVaccineRegistryEditForm(token, initialData, clientId, petId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: VaccineRegistryFormData) => {
    try {
      await updateVaccineRegistry(token, initialData.id, {
        vaccineId: data.vaccineId,
        petId: data.petId!,
        dose: data.dose,
        applicationDate: new Date(data.applicationDate).toISOString(),
        expectedDate: new Date(data.expectedDate).toISOString(),
      });
      toast("success", "Registro actualizado correctamente");
      router.back();
    } catch {
      toast("error", "Error al actualizar el registro");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Cargando datos del registro...
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SearchableSelect
        label="Cliente"
        value={clientSearch}
        options={clients}
        onChangeSearch={(val) => {
          setClientSearch(val);
          if (val.trim() === "") {
            setValue("clientId", 0);
          }
        }}
        onSelect={(v) => {
          setValue("clientId", v.id);
          setClientSearch(v.label);
        }}
      />
      {errors.clientId && (
        <p className="text-red-500 text-sm">{errors.clientId.message}</p>
      )}

      <SearchableSelect
        label="Mascota"
        value={petSearch}
        options={pets}
        onChangeSearch={(val) => {
          setPetSearch(val);
          if (val.trim() === "") {
            setValue("petId", 0);
          }
        }}
        onSelect={(v) => {
          setValue("petId", v.id);
          setPetSearch(v.label);
        }}
      />
      {errors.petId && (
        <p className="text-red-500 text-sm">{errors.petId.message}</p>
      )}

      <SearchableSelect
        label="Vacuna"
        value={vaccineSearch}
        options={vaccines}
        onChangeSearch={(val) => {
          setVaccineSearch(val);
          if (val.trim() === "") {
            setValue("vaccineId", 0);
          }
        }}
        onSelect={(v) => {
          setValue("vaccineId", v.id);
          setVaccineSearch(v.label);
        }}
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
        <label className="block text-sm font-medium">Fecha de aplicación</label>
        <Input type="datetime-local" {...register("applicationDate")} />
        {errors.applicationDate && (
          <p className="text-red-500 text-sm">
            {errors.applicationDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Próxima aplicación</label>
        <Input type="datetime-local" {...register("expectedDate")} />
        {errors.expectedDate && (
          <p className="text-red-500 text-sm">{errors.expectedDate.message}</p>
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
    </form>
  );
}
