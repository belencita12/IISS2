"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import NumericInput from "@/components/global/NumericInput";
import Image from "next/image";
import { useVaccineForm } from "@/hooks/vaccine/useVaccineForm";
import { VaccineFormValues } from "@/lib/vaccine/IVaccine";
import { useTranslations } from "next-intl";

interface VaccineFormProps {
  token: string | null;
  initialData?: VaccineFormValues;
}

export default function VaccineForm({ token, initialData }: VaccineFormProps) {
  const {
    register,
    handleSubmit,
    onSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    isEdit,
    manufacturerSearch,
    speciesSearch,
    setManufacturerSearch,
    setSpeciesSearch,
    isManufacturerListVisible,
    isSpeciesListVisible,
    validateManufacturerSelection,
    validateSpeciesSelection,
    setIsSpeciesListVisible,
    setIsManufacturerListVisible,
    manufacturers,
    species,
    goToManufacturerPage,
    goBackToVaccineList,
    providerSearch,
    setProviderSearch,
    setIsProviderListVisible,
    isProviderListVisible,
    filteredProviders,
    validateProviderSelection,
    setSelectedProviderId,
    setSelectedManufacturerId,
    setSelectedSpeciesId,
    isLoadingSpecies,
    isLoadingManufacturers,
    isLoadingProviders,
  } = useVaccineForm(token, initialData);

  const v = useTranslations("VaccineForm");
  const b = useTranslations("Button");
  const ph = useTranslations("Placeholder")

  return (
    <div className="p-4 mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">
        {isEdit ? v("titleEdit") : v("titleRegister")}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-2">{v("name")}</label>
          <Input
            {...register("name")}
            placeholder={ph("name")}
            className="mb-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Fabricante */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium mb-2">{v("manufacturer")}</label>
          </div>
          <div className="relative">
            <Input
              type="text"
              value={manufacturerSearch}
              onChange={(e) => setManufacturerSearch(e.target.value)}
              onBlur={validateManufacturerSelection}
              onFocus={() => setIsManufacturerListVisible(true)}
              placeholder={ph("getBy", {field : "fabricante"})}
              className="w-full mb-2 pr-10"
            />
            <button
              type="button"
              onClick={() => goToManufacturerPage()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-black rounded-full"
              title={b("add")}
            >
              <Plus size={18} />
            </button>
            {isManufacturerListVisible && (
              <div className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                {isLoadingManufacturers ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  manufacturers.map((manu) => (
                    <div
                      key={manu.id}
                      onMouseDown={() => {
                        setSelectedManufacturerId(manu.id);
                        setManufacturerSearch(manu.name);
                        setValue("manufacturerId", manu.id);
                        setIsManufacturerListVisible(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {manu.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {errors.manufacturerId && (
            <p className="text-red-500 text-sm">
              {errors.manufacturerId.message}
            </p>
          )}
        </div>

        {/* Especie */}
        <div>
          <label className="block text-sm font-medium mb-2">{v("specie")}</label>
          <div className="relative">
            <Input
              type="text"
              value={speciesSearch}
              onChange={(e) => setSpeciesSearch(e.target.value)}
              onFocus={() => setIsSpeciesListVisible(true)}
              onBlur={validateSpeciesSelection}
              placeholder={ph("getBy", {field : "especie"})}
              className="w-full mb-2"
            />
            {isSpeciesListVisible && (
              <div className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                {isLoadingSpecies ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  species.map((spec) => (
                    <div
                      key={spec.id}
                      onMouseDown={() => {
                        setSelectedSpeciesId(spec.id);
                        setSpeciesSearch(spec.name);
                        setValue("speciesId", spec.id);
                        setIsSpeciesListVisible(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {spec.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Costo */}
        <div>
          <label className="block text-sm font-medium mb-2">{v("cost")}</label>
          <NumericInput
            id="cost"
            type="formattedNumber"
            placeholder={ph("cost")}
            value={watch("cost") ?? ""}
            onChange={(e) =>
              setValue("cost", Number(e.target.value), { shouldValidate: true })
            }
            className="mb-2"
            error={errors.cost?.message}
          />
        </div>

        {/* IVA */}
        <div>
          <label className="block text-sm font-medium mb-2">{v("iva")}</label>
          <NumericInput
            id="iva"
            type="formattedNumber"
            placeholder={ph("iva")}
            value={watch("iva") ?? ""}
            onChange={(e) =>
              setValue("iva", Number(e.target.value), { shouldValidate: true })
            }
            className="mb-2"
            error={errors.iva?.message}
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium mb-2">{v("price")}</label>
          <NumericInput
            id="price"
            type="formattedNumber"
            placeholder={ph("price")}
            value={watch("price") ?? ""}
            onChange={(e) =>
              setValue("price", Number(e.target.value), {
                shouldValidate: true,
              })
            }
            className="mb-2"
            error={errors.price?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{v("description")}</label>
          <Input
            {...register("description")}
            placeholder={ph("description")}
            className="mb-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Proveedor */}
        <div>
          <label className="block text-sm font-medium mb-2">{v("provider")}</label>
          <div className="relative">
            <Input
              type="text"
              value={providerSearch}
              onChange={(e) => setProviderSearch(e.target.value)}
              onFocus={() => setIsProviderListVisible(true)}
              onBlur={validateProviderSelection}
              placeholder={ph("getBy", { field : "proveedor"})}
              className="w-full mb-2"
            />
            {isProviderListVisible && (
              <div className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                {isLoadingProviders ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  filteredProviders.map((prov) => (
                    <div
                      key={prov.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        setSelectedProviderId(prov.id ?? null);
                        setProviderSearch(prov.businessName);
                        setValue("providerId", prov.id ?? 0);
                        setIsProviderListVisible(false);
                      }}
                    >
                      {prov.businessName} - {prov.ruc}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {errors.providerId && (
            <p className="text-red-500 text-sm">{errors.providerId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {v("image")}
          </label>

          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Imagen opcional*/}
            {isEdit && initialData?.productImgUrl && (
              <div className="flex items-center">
                <Image
                  src={initialData.productImgUrl}
                  alt="Imagen actual"
                  width={40}
                  height={40}
                  className="object-contain border rounded"
                />
              </div>
            )}

            <Input
              type="file"
              className="mb-0"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setValue("productImg", file);
              }}
            />
            {errors.productImg?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.productImg.message)}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => goBackToVaccineList()}
            disabled={isSubmitting}
          >
            {b("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? b("saving")
                : b("adding")
              : isEdit
              ? b("save")
              : b("add")}
          </Button>
        </div>
      </form>
    </div>
  );
}
