"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/global/FormInput";
import FormSelect from "@/components/global/FormSelect";
import FormImgUploader from "@/components/global/FormImgUploader";
import PetSexSelector from "@/components/admin/pet/PetSexSelector";
import CustomerSearch from "@/components/admin/sales/CustomerSearch";
import { blockExtraKeysNumber } from "@/lib/utils";
import { usePetRegisterForm } from "@/hooks/pets/usePetForm";
import { ClientData } from "@/lib/admin/client/IClient";
import { useTranslations } from "next-intl";

interface AdminPetFormProps {
  token: string;
}
export default function PetRegisterForm({ token }: AdminPetFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<ClientData | null>(
null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    species,
    races,
    isGettingSpecies,
    isGettingRaces,
    selectedSpeciesId,
    handleImageChange,
    handleSpeciesChange,
    handleRaceChange,
    onSexChange,
    onSubmit,
    handleClientChange,
    watch,
  } = usePetRegisterForm(token);

  const t = useTranslations();

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="flex flex-col items-center space-y-4 w-80">
          <h1 className="text-3xl font-bold self-start">
            {t("pet.form.titleAdmin")}
          </h1>
          <p className="text-gray-600">
            {t("pet.form.description")}
          </p>
          <div className="w-full flex flex-col items-center">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">
              {t("pet.form.imageOpcional")}
            </h3>
            <FormImgUploader
              prevClassName="rounded"
              onChange={handleImageChange}
            />
            {errors.profileImg?.message && (
              <p className="text-sm text-destructive mt-2">
                {errors.profileImg.message}
              </p>
            )}
          </div>
        </div>
        <div className="md:w-2/3 w-80">
          <form
            id="petForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h5 className="text-sm font-medium">{t("pet.form.client")}</h5>
              <CustomerSearch
                token={token}
                onSelectCustomer={(customer) => {
                  setSelectedCustomer(customer);
                  handleClientChange(customer);
                }}
              />
              {errors.clientId && (
                <p className="text-sm text-destructive -mt-1">
                  {errors.clientId.message}
                </p>
              )}
              {selectedCustomer && (
                <div className="border rounded-md p-3 bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomer(null);
                      handleClientChange({
                        id: "",
                        fullName: "",
                        email: "",
                      } as ClientData);
                    }}
                    className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-500"
                    aria-label="Borrar cliente"
                  >
                    &times;
                  </button>
                  <h3 className="font-medium">{selectedCustomer.fullName}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedCustomer.email}
                  </p>
                </div>
              )}
            </div>
            <FormInput
              register={register("name")}
              error={errors.name?.message}
              label={t("pet.form.name")}
              placeholder={t("placeholder.name")}
              name="name"
            />
            <FormInput
              register={register("dateOfBirth")}
              error={errors.dateOfBirth?.message}
              label={t("pet.form.born")}
              type="date"
              name="dateOfBirth"
              max={new Date().toISOString().split("T")[0]}
            />
            <div className="flex gap-4">
              <div className="w-1/2">
                <FormSelect
                  label={t("pet.form.specie")}
                  name="speciesId"
                  disabled={isGettingSpecies}
                  onChange={handleSpeciesChange}
                  register={register("speciesId")}
                  error={errors.speciesId?.message}
                  placeholder={
                    isGettingSpecies
                      ? t("button.loading")
                      : t("placeholder.select")
                  }
                  options={species?.data.map((s) => ({
                    value: s.id.toString(),
                    label: s.name,
                  }))}
                />
              </div>
              <div className="w-1/2">
                <FormSelect
                  label={t("pet.form.race")}
                  name="raceId"
                  disabled={isGettingRaces || !selectedSpeciesId}
                  register={register("raceId")}
                  onChange={handleRaceChange}
                  error={errors.raceId?.message}
                  placeholder={
                    !selectedSpeciesId
                      ? t("placeholder.selectSpecieFirst")
                      : isGettingRaces
                      ? t("button.loading")
                      : t("placeholder.select")
                  }
                  options={races?.data.map((r) => ({
                    value: r.id.toString(),
                    label: r.name,
                  }))}
                />
              </div>
            </div>
            <FormInput
              id="weight"
              type="number"
              step={0.1}
              min="0"
              onKeyDown={blockExtraKeysNumber}
              register={register("weight")}
              error={errors.weight?.message}
              label={t("pet.form.weight")}
              name="weight"
            />
            <PetSexSelector
              error={errors.sex?.message}
              selected={watch("sex")}
              onChange={onSexChange}
            />
            <div className="flex justify-start gap-4 mt-16">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                <Link href="/dashboard/settings/pets">{t("button.cancel")}</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("button.registering") : t("button.register")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
