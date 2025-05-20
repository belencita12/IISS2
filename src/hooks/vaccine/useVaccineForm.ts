// src/hooks/useVaccineForm.ts

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { getManufacturers } from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";
import { getAllSpecies } from "@/lib/pets/getRacesAndSpecies";
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
  iva: z.number().min(1, "El IVA debe ser mayor a 0").max(100, "El IVA no puede ser mayor a 100"),
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
  const [providerSearch, setProviderSearch] = useState(initialData?.provider?.businessName || "");
  const [isProviderListVisible, setIsProviderListVisible] = useState(false);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(initialData?.providerId || null);
  const [isLoadingManufacturers, setIsLoadingManufacturers] = useState(false);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
    if (!token) return;

    const fetchProviders = async () => {
      setIsLoadingProviders(true);
      try {
        const res = await getProviders(token, {
          page: 1,
          ...(providerSearch ? { query: providerSearch } : {}),
        });
        const sorted = res.data.sort((a: { businessName: string; }, b: { businessName: string; }) =>
          a.businessName.localeCompare(b.businessName)
        );
        setFilteredProviders(sorted);
      } catch {
        toast("error", "No se pudieron cargar los proveedores");
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, [providerSearch, token]);


  useEffect(() => {
    if (!token) return;

    const fetchManufacturers = async () => {
      setIsLoadingManufacturers(true);
      try {
        const res = await getManufacturers(token, 1, manufacturerSearch);
        const sorted = res.data.sort((a: Manufacturer, b: Manufacturer) =>
          a.name.localeCompare(b.name)
        );
        setManufacturers(sorted);
      } catch {
        toast("error", "No se pudieron cargar los fabricantes");
      } finally {
        setIsLoadingManufacturers(false);
      }
    };

    fetchManufacturers();
  }, [manufacturerSearch, token]);





  useEffect(() => {
    if (!token) return;

    const fetchSpecies = async () => {
      setIsLoadingSpecies(true);
      try {
        const res = await getAllSpecies(token, `page=1&name=${encodeURIComponent(speciesSearch)}`);
        const sorted = res.data.sort((a: Species, b: Species) =>
          a.name.localeCompare(b.name)
        );
        setSpecies(sorted);
      } catch {
        toast("error", "Error al cargar especies");
      } finally {
        setIsLoadingSpecies(false);
      }
    };

    fetchSpecies();
  }, [speciesSearch, token]);



  const validateProviderSelection = () => {
    setTimeout(() => setIsProviderListVisible(false), 200);
    const found = filteredProviders.find((p) =>
      p.businessName.toLowerCase() === providerSearch.toLowerCase()
    );

    if (found) {
      setSelectedProviderId(found.id ?? null);
      setValue("providerId", found.id ?? 0);
    } else {
      setProviderSearch("");
      setSelectedProviderId(null);
      setValue("providerId", 0);
    }
  };

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
          providerId: selectedProviderId!,
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
        formData.append("providerId", selectedProviderId!.toString());
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
            const errorData = await response.json().catch(() => ({})); // fallback si no es JSON
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }

        toast("success", "Vacuna creada exitosamente");
      }

      router.push("/dashboard/vaccine");
    } catch (error : unknown) {
      toast(
        "error",
        isEdit
          ? error instanceof Error
            ? error.message
            : "Error al actualizar la vacuna"
          : error instanceof Error
            ? error.message
            : "Error al crear la vacuna"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateManufacturerSelection = () => {
    setIsManufacturerListVisible(false);
    const found = manufacturers.find((m) =>
      m.name.toLowerCase() === manufacturerSearch.toLowerCase()
    );

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
    setIsSpeciesListVisible(false);
    const found = species.find((s) =>
      s.name.toLowerCase() === speciesSearch.toLowerCase()
    );

    if (found) {
      setSelectedSpeciesId(found.id);
      setValue("speciesId", found.id);
    } else {
      setSpeciesSearch("");
      setSelectedSpeciesId(null);
      setValue("speciesId", 0);
    }
  };


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
    reset,
    watch,
    errors,
    isSubmitting,
    isEdit,

    // valores reactivos usados por campos numéricos
    cost: watch("cost"),
    iva: watch("iva"),
    price: watch("price"),

    // fabricante
    manufacturers,
    manufacturerSearch,
    setManufacturerSearch,
    isManufacturerListVisible,
    setIsManufacturerListVisible,
    validateManufacturerSelection,
    setSelectedManufacturerId,

    // especie
    species,
    speciesSearch,
    setSpeciesSearch,
    isSpeciesListVisible,
    setIsSpeciesListVisible,
    validateSpeciesSelection,
    setSelectedSpeciesId,

    // proveedor
    providerSearch,
    setProviderSearch,
    filteredProviders,
    isProviderListVisible,
    setIsProviderListVisible,
    setSelectedProviderId,
    validateProviderSelection,

    // navegación
    goToManufacturerPage,
    goBackToVaccineList,


    isLoadingManufacturers,
    isLoadingSpecies,
    isLoadingProviders,

  };


}
