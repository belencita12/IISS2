// src/hooks/useVaccineForm.ts

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { getManufacturers } from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";
import { getSpecies } from "@/lib/pets/getRacesAndSpecies";
import { updateVaccineById } from "@/lib/vaccine/updateVaccine";
import { VaccineFormValues, Manufacturer, Species } from "@/lib/vaccine/IVaccine";
import { getProviders } from "@/lib/provider/getProviders";
import { Provider } from "@/lib/provider/IProvider";

// Form schema
const vaccineSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  manufacturerId: z.number().min(1, "Seleccione un fabricante"),
  speciesId: z.number().min(1, "Seleccione una especie"),
  cost: z.number().min(1, "El costo debe ser mayor a 0"),
  iva: z.number().min(1, "El IVA debe ser mayor a 0"),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  productImg: z.any().optional(),
  providerId: z.number().min(1, "Seleccione un proveedor"),
  description: z.string().min(1, "La descripción es obligatoria"),
});


export type VaccineFormData = z.infer<typeof vaccineSchema>;

export function useVaccineForm(token: string | null, initialData?: VaccineFormValues) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [manufacturerSearch, setManufacturerSearch] = useState(initialData?.manufacturer.name || "");
  const [speciesSearch, setSpeciesSearch] = useState(initialData?.species.name || "");
  const [isManufacturerListVisible, setIsManufacturerListVisible] = useState(false);
  const [isSpeciesListVisible, setIsSpeciesListVisible] = useState(false);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<number | null>(initialData?.manufacturer.id || null);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(initialData?.species.id || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providerSearch, setProviderSearch] = useState("");
  const [isProviderListVisible, setIsProviderListVisible] = useState(false);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      providerId: initialData?.providerId || 0,
      description: initialData?.description || "",
    },

  });

  useEffect(() => {
    const fetchProvidersList = async () => {
      if (!token) return;
      try {
        const res = await getProviders(token, { page: 1, query: providerSearch });
        setFilteredProviders(res.data); // asumiendo que `res.data` tiene la lista
      } catch {
        toast("error", "No se pudieron cargar los proveedores");
      }
    };

    if (providerSearch) fetchProvidersList();
  }, [providerSearch, token]);


  useEffect(() => {
    if (token) {
      // Cargar fabricantes
      getManufacturers(token)
        .then(({ data }) => {
          const sorted = data.sort((a: Manufacturer, b: Manufacturer) =>
            a.name.localeCompare(b.name)
          );
          setManufacturers(sorted);
        })
        .catch((error) => {
          toast(error, "Error al cargar fabricantes");
        });
      // Cargar especies
      getSpecies(token)
        .then((data) => {
          const sorted = data.sort((a: Species, b: Species) =>
            a.name.localeCompare(b.name)
          );
          setSpecies(sorted);
        })
        .catch((error) => {
          toast(error, "Error al cargar especies");
        });
    }
  }, [token]);

  const onSubmit = async (data: VaccineFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!selectedManufacturerId || !selectedSpeciesId) {
      toast("error", "Debe seleccionar un fabricante y una especie válidos.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEdit) {
        await updateVaccineById(token!, initialData!.id, {
          name: data.name,
          manufacturerId: selectedManufacturerId!,
          speciesId: selectedSpeciesId!,
          cost: data.cost,
          iva: data.iva,
          price: data.price,
          providerId: data.providerId,
          description: data.description,
          productImg: data.productImg instanceof File ? data.productImg : null,
        });

        toast("success", "Vacuna actualizada exitosamente");
      } else {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("manufacturerId", selectedManufacturerId!.toString());
        formData.append("speciesId", selectedSpeciesId!.toString());
        formData.append("cost", data.cost.toString());
        formData.append("iva", data.iva.toString());
        formData.append("price", data.price.toString());
        formData.append("providerId", data.providerId.toString());
        formData.append("description", data.description);

        if (data.productImg instanceof File) {
          formData.append("productImg", data.productImg);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vaccine`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error al crear la vacuna");
        }

        toast("success", "Vacuna creada exitosamente");
      }

      router.push("/dashboard/vaccine");
    } catch (error) {
      toast("error", isEdit ? "Error al actualizar la vacuna" : "Error al crear la vacuna");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateManufacturerSelection = () => {
    setTimeout(() => setIsManufacturerListVisible(false), 200);
    const found = manufacturers.find((m) => m.name.toLowerCase() === manufacturerSearch.toLowerCase());
    if (found) {
      setSelectedManufacturerId(found.id);
      setValue("manufacturerId", found.id);
    } else {
      setManufacturerSearch("");
      setSelectedManufacturerId(null);
      setValue("manufacturerId", 0);
    }
  };

  const validateSpeciesSelection = () => {
    setTimeout(() => setIsSpeciesListVisible(false), 200);
    const found = species.find((s) => s.name.toLowerCase() === speciesSearch.toLowerCase());
    if (found) {
      setSelectedSpeciesId(found.id);
      setValue("speciesId", found.id);
    } else {
      setSpeciesSearch("");
      setSelectedSpeciesId(null);
      setValue("speciesId", 0);
    }
  };

  const filteredManufacturers = manufacturers.filter((manu) =>
    manu.name.toLowerCase().includes(manufacturerSearch.toLowerCase())
  );

  const filteredSpecies = species.filter((spec) =>
    spec.name.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  const goToManufacturerPage = () => {
    router.push("/dashboard/vaccine/manufacturer/new");
  };

  const goBackToVaccineList = () => {
    router.push("/dashboard/vaccine");
  };


  return {
    register,
    handleSubmit,
    onSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    isEdit,
    manufacturers,
    species,
    manufacturerSearch,
    speciesSearch,
    setManufacturerSearch,
    setSpeciesSearch,
    isManufacturerListVisible,
    isSpeciesListVisible,
    validateManufacturerSelection,
    validateSpeciesSelection,
    setIsManufacturerListVisible,
    setIsSpeciesListVisible,
    filteredManufacturers,
    filteredSpecies,
    setSelectedManufacturerId,
    setSelectedSpeciesId,
    goToManufacturerPage,
    goBackToVaccineList,
    providerSearch,
    setProviderSearch,
    filteredProviders,
    isProviderListVisible,
    setIsProviderListVisible,
  };

}
