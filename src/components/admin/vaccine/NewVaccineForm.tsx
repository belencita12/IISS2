"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import NumericInput from "@/components/global/NumericInput";
import Image from "next/image";
import { useVaccineForm } from "@/hooks/vaccine/useVaccineForm";
import { VaccineFormValues } from "@/lib/vaccine/IVaccine";

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

  return (
    <div className="p-4 mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">
        {isEdit ? "Editar Vacuna" : "Agregar Vacuna"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-2">Nombre</label>
          <Input
            {...register("name")}
            placeholder="Ingrese un nombre"
            className="mb-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Fabricante */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium mb-2">Fabricante</label>
          </div>
          <div className="relative">
            <Input
              type="text"
              value={manufacturerSearch}
              onChange={(e) => setManufacturerSearch(e.target.value)}
              onBlur={validateManufacturerSelection}
              onFocus={() => setIsManufacturerListVisible(true)}
              placeholder="Buscar fabricante..."
              className="w-full mb-2 pr-10"
            />
            <button
              type="button"
              onClick={() => goToManufacturerPage()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-black rounded-full"
              title="Agregar Fabricante"
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
          <label className="block text-sm font-medium mb-2">Especie</label>
          <div className="relative">
            <Input
              type="text"
              value={speciesSearch}
              onChange={(e) => setSpeciesSearch(e.target.value)}
              onFocus={() => setIsSpeciesListVisible(true)}
              onBlur={validateSpeciesSelection}
              placeholder="Buscar especie..."
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
          <label className="block text-sm font-medium mb-2">Costo</label>
          <NumericInput
            id="cost"
            type="formattedNumber"
            placeholder="Ingrese el costo"
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
          <label className="block text-sm font-medium mb-2">IVA</label>
          <NumericInput
            id="iva"
            type="formattedNumber"
            placeholder="Ingrese el IVA"
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
          <label className="block text-sm font-medium mb-2">Precio</label>
          <NumericInput
            id="price"
            type="formattedNumber"
            placeholder="Ingrese el precio"
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
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <Input
            {...register("description")}
            placeholder="Ingrese una descripción"
            className="mb-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Proveedor */}
        <div>
          <label className="block text-sm font-medium mb-2">Proveedor</label>
          <div className="relative">
            <Input
              type="text"
              value={providerSearch}
              onChange={(e) => setProviderSearch(e.target.value)}
              onFocus={() => setIsProviderListVisible(true)}
              onBlur={validateProviderSelection}
              placeholder="Buscar proveedor..."
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
            Imagen del producto (opcional)
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
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? "Guardando cambios..."
                : "Guardando..."
              : isEdit
              ? "Guardar Cambios"
              : "Agregar Vacuna"}
          </Button>
        </div>
      </form>
    </div>
  );
}
