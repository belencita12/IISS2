"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { getManufacturers } from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";
import { getSpecies } from "@/lib/pets/getRacesAndSpecies";
import { Plus } from "lucide-react";

// Interfaces
interface Manufacturer {
  id: number;
  name: string;
}

interface Species {
  id: number;
  name: string;
}

// Definición del esquema de validación con Zod
const vaccineSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  manufacturerId: z.number({required_error: "Seleccione un fabricante"}).min(1, "Seleccione un fabricante"),
  speciesId: z.number({required_error: "Seleccione una especie"}).min(1, "Seleccione una especie"),
  cost: z
    .number({ message: "Complete con valores numéricos adecuados" })
    .min(1, "El costo debe ser mayor a 0"),
  iva: z
    .number({ message: "Complete con valores numéricos adecuados" })
    .min(1, "El IVA debe ser mayor a 0"),
  price: z
    .number({ message: "Complete con valores numéricos adecuados" })
    .min(1, "El precio debe ser mayor a 0"),
  productImg: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File && ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type);
    }, "El archivo debe ser una imagen válida (JPG, PNG, GIF, WEBP)")
    .refine((file) => {
      if (!file) return true;
      return file.size <= 1 * 1024 * 1024;
    }, "La imagen no debe superar los 1MB"),
});

// Tipado basado en el esquema
type VaccineFormData = z.infer<typeof vaccineSchema>;

// Props para el formulario unificado: si se pasan datos iniciales, se asume edición
interface VaccineFormProps {
  token: string | null;
  initialData?: {
    id: number;
    name: string;
    manufacturer: Manufacturer;
    species: Species;
    cost: number;
    iva: number;
    price: number;
  };
}

export default function VaccineForm({ token, initialData }: VaccineFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  // Estados para fabricantes, especies y búsqueda
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [manufacturerSearch, setManufacturerSearch] = useState(initialData ? initialData.manufacturer.name : "");
  const [speciesSearch, setSpeciesSearch] = useState(initialData ? initialData.species.name : "");
  const [isManufacturerListVisible, setIsManufacturerListVisible] = useState(false);
  const [isSpeciesListVisible, setIsSpeciesListVisible] = useState(false);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<number | null>(
    initialData ? initialData.manufacturer.id : null
  );
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(
    initialData ? initialData.species.id : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuración de React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VaccineFormData>({
    resolver: zodResolver(vaccineSchema),
    defaultValues: {
      name: initialData?.name || "",
      manufacturerId: initialData?.manufacturer.id,
      speciesId: initialData?.species.id,
      cost: initialData?.cost,
      iva: initialData?.iva,
      price: initialData?.price,
    },
  });

  useEffect(() => {
    if (token) {
      // Cargar fabricantes
      getManufacturers(token)
        .then(({data}) => {
          const sorted = data.sort((a: Manufacturer, b: Manufacturer) => a.name.localeCompare(b.name));
          setManufacturers(sorted);
        })
        .catch((error) => {
          console.error("Error cargando fabricantes:", error);
          toast("error", "Error al cargar fabricantes");
        });
      // Cargar especies
      getSpecies(token)
        .then((data) => {
          const sorted = data.sort((a: Species, b: Species) => a.name.localeCompare(b.name));
          setSpecies(sorted);
        })
        .catch((error) => {
          console.error("Error cargando especies:", error);
          toast("error", "Error al cargar especies");
        });
    }
  }, [token]);

  const preventNegativeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-") {
      e.preventDefault();
      toast("error", "No se permiten valores negativos");
    }
  };

  const filteredManufacturers = manufacturers.filter((manu) =>
    manu.name.toLowerCase().includes(manufacturerSearch.toLowerCase())
  );
  const filteredSpecies = species.filter((spec) =>
    spec.name.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  // Función para enviar el formulario
  const onSubmit = async (data: VaccineFormData) => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  // Validación de selección
  const isManufacturerValid = manufacturers.some((m) => m.id === selectedManufacturerId);
  const isSpeciesValid = species.some((s) => s.id === selectedSpeciesId);

  if (!isManufacturerValid || !isSpeciesValid) {
    toast("error", "Debe seleccionar un fabricante y una especie válidos de la lista.");
    setIsSubmitting(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("manufacturerId", selectedManufacturerId?.toString() || "0");
    formData.append("speciesId", selectedSpeciesId?.toString() || "0");
    formData.append("cost", data.cost.toString());
    formData.append("iva", data.iva.toString());
    formData.append("price", data.price.toString());

    if (data.productImg instanceof File) {
      formData.append("productImg", data.productImg);
    }

    // Si es edición, llamamos a PUT; si es creación, a POST
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/vaccine/${initialData?.id}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/vaccine`;
    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(isEdit ? "Error al actualizar la vacuna" : "Error al crear la vacuna");
    }

    toast("success", isEdit ? "Vacuna actualizada exitosamente" : "Vacuna creada exitosamente");
    router.push("/dashboard/vaccine");
  } catch (error) {
    console.error(error);
    toast("error", isEdit ? "Error al actualizar la vacuna" : "Error al crear la vacuna");
  } finally {
    setIsSubmitting(false);
  }
};

  const validateManufacturerSelection = () => {
    setTimeout(() => setIsManufacturerListVisible(false), 200);
    const found = manufacturers.find((m) => m.name.toLowerCase() === manufacturerSearch.toLowerCase());
    if (!found) {
      setManufacturerSearch("");
      setSelectedManufacturerId(null);
      setValue("manufacturerId", 0);
    } else {
      setSelectedManufacturerId(found.id);
      setValue("manufacturerId", found.id);
    }
  };

  const validateSpeciesSelection = () => {
    setTimeout(() => setIsSpeciesListVisible(false), 200);
    const found = species.find((s) => s.name.toLowerCase() === speciesSearch.toLowerCase());
    if (!found) {
      setSpeciesSearch("");
      setSelectedSpeciesId(null);
      setValue("speciesId", 0);
    } else {
      setSelectedSpeciesId(found.id);
      setValue("speciesId", found.id);
    }
  };

  return (
    <div className="p-4 mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">
        {isEdit ? "Editar Vacuna" : "Agregar Vacuna"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-2">Nombre</label>
          <Input {...register("name")} placeholder="Ingrese un nombre" className="mb-2"/>
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
              onClick={() => router.push("/dashboard/vaccine/manufacturer/new")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-black rounded-full"
              title="Agregar Fabricante"
            >
              <Plus size={18} />
            </button>
            {isManufacturerListVisible && (
              <div className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                {filteredManufacturers.map((manu) => (
                  <div
                    key={manu.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedManufacturerId(manu.id);
                      setManufacturerSearch(manu.name);
                      setValue("manufacturerId", manu.id);
                      setIsManufacturerListVisible(false);
                    }}
                  >
                    {manu.name}
                  </div>
                ))}
              </div>
            )}            
          </div>          
          {errors.manufacturerId && <p className="text-red-500 text-sm">{errors.manufacturerId.message}</p>}
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
                {filteredSpecies.map((spec) => (
                  <div
                    key={spec.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedSpeciesId(spec.id);
                      setSpeciesSearch(spec.name);
                      setValue("speciesId", spec.id);
                      setIsSpeciesListVisible(false);
                    }}
                  >
                    {spec.name}
                  </div>
                ))}
              </div>
            )}
          </div>          
          {errors.speciesId && <p className="text-red-500 text-sm">{errors.speciesId.message}</p>}
        </div>

        {/* Costo */}
        <div>
          <label className="block text-sm font-medium mb-2">Costo</label>
          <Input
            type="number"
            {...register("cost", { valueAsNumber: true })}
            onKeyDown={preventNegativeInput}
            placeholder="Ingrese el costo"
            className="mb-2"
          />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
        </div>

        {/* IVA */}
        <div>
          <label className="block text-sm font-medium mb-2">IVA</label>
          <Input
            type="number"
            {...register("iva", { valueAsNumber: true })}
            onKeyDown={preventNegativeInput}
            placeholder="Ingrese el IVA"
            className="mb-2"
          />
          {errors.iva && <p className="text-red-500 text-sm">{errors.iva.message}</p>}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium mb-2">Precio</label>
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            onKeyDown={preventNegativeInput}
            placeholder="Ingrese el precio"
            className="mb-2"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium mb-2">Imagen del producto (opcional)</label>
          <Input
            type="file"
            className="mb-2"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue("productImg", file);
            }}
          />
          {errors.productImg?.message && (
            <p className="text-red-500 text-sm">{String(errors.productImg.message)}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/vaccine")}
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
