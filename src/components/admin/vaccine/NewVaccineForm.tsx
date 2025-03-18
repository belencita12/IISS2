"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { getManufacturers } from "@/lib/vaccine-manufacturer/getAllManufacturers";
import { getSpecies } from "@/lib/pets/getRacesAndSpecies";

// Interfaces
interface Manufacturer {
    id: number;
    name: string;
}

interface Species {
    id: number;
    name: string;
}

const vaccineSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    manufacturerId: z.number().min(1, "Seleccione un fabricante"),
    speciesId: z.number().min(1, "Seleccione una especie"),
    cost: z.number({ message: "Complete con valores numéricos adecuados" }).min(1, "El costo debe ser mayor a 0"),
    iva: z.number({ message: "Complete con valores numéricos adecuados" }).min(1, "El IVA debe ser mayor a 0"),
    price: z.number({ message: "Complete con valores numéricos adecuados" }).min(1, "El precio debe ser mayor a 0"),
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


// Tipado basado en el esquema de Zod
type VaccineFormData = z.infer<typeof vaccineSchema>;

export default function NewVaccineForm({ token }: { token: string | null }) {
    const router = useRouter();
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);
    const [manufacturerSearch, setManufacturerSearch] = useState("");
    const [speciesSearch, setSpeciesSearch] = useState("");
    const [isManufacturerListVisible, setIsManufacturerListVisible] = useState(false);
    const [isSpeciesListVisible, setIsSpeciesListVisible] = useState(false);
    const [selectedManufacturerId, setSelectedManufacturerId] = useState<number | null>(null);
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);



    // Hook de React Hook Form con Zod
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<VaccineFormData>({
        resolver: zodResolver(vaccineSchema),
        defaultValues: {
            name: "",
            manufacturerId: undefined,
            speciesId: undefined,
            cost: undefined,
            iva: undefined,
            price: undefined,
        },
    });

    useEffect(() => {
        if (token) {
            getManufacturers(token)
                .then((data) => {
                    const sortedManufacturers = data.sort((a, b) => a.name.localeCompare(b.name));
                    setManufacturers(sortedManufacturers);
                })
                .catch((error) => {
                    console.error("Error cargando fabricantes:", error);
                    toast("error", "Error al cargar fabricantes");
                });

            getSpecies(token)
                .then((data) => {
                    const sortedSpecies = data.sort((a: Species, b: Species) => a.name.localeCompare(b.name));
                    setSpecies(sortedSpecies);
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

    const filteredManufacturers = manufacturers.filter((manufacturer) =>
        manufacturer.name.toLowerCase().includes(manufacturerSearch.toLowerCase())
    );

    const filteredSpecies = species.filter((specie) =>
        specie.name.toLowerCase().includes(speciesSearch.toLowerCase())
    );


    const onSubmit = async (data: VaccineFormData) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        const isManufacturerValid = manufacturers.some(m => m.id === selectedManufacturerId);
        const isSpeciesValid = species.some(s => s.id === selectedSpeciesId);

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

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vaccine`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al crear la vacuna");
            }

            toast("success", "Vacuna creada exitosamente");
            router.push("/dashboard/vaccine");
        } catch (error) {
            toast("error", "Error al crear la vacuna");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const validateManufacturerSelection = () => {
        setTimeout(() => setIsManufacturerListVisible(false), 200);

        const found = manufacturers.find(m => m.name.toLowerCase() === manufacturerSearch.toLowerCase());

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

        const found = species.find(s => s.name.toLowerCase() === speciesSearch.toLowerCase());

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
            <h2 className="text-3xl font-bold mb-6">Agregar Vacuna</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <Input {...register("name")} placeholder="Ingrese un nombre" />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Fabricante */}
                <div>
                    <label className="block text-sm font-medium mb-2">Fabricante</label>
                    <div className="relative">
                        <Input
                            type="text"
                            value={manufacturerSearch}
                            onChange={(e) => setManufacturerSearch(e.target.value)}
                            onFocus={() => setIsManufacturerListVisible(true)}
                            onBlur={validateManufacturerSelection} // Validación en onBlur
                            placeholder="Buscar fabricante..."
                            className="w-full mb-2"
                        />
                        {isManufacturerListVisible && (
                            <div className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                                {filteredManufacturers.map((manufacturer) => (
                                    <div
                                        key={manufacturer.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSelectedManufacturerId(manufacturer.id);
                                            setManufacturerSearch(manufacturer.name);
                                            setValue("manufacturerId", manufacturer.id);
                                            setIsManufacturerListVisible(false);
                                        }}
                                    >
                                        {manufacturer.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
                            onBlur={validateSpeciesSelection} // Validación en onBlur
                            placeholder="Buscar especie..."
                            className="w-full mb-2"
                        />
                        {isSpeciesListVisible && (
                            <div className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                                {filteredSpecies.map((specie) => (
                                    <div
                                        key={specie.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSelectedSpeciesId(specie.id);
                                            setSpeciesSearch(specie.name);
                                            setValue("speciesId", specie.id);
                                            setIsSpeciesListVisible(false);
                                        }}
                                    >
                                        {specie.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                {/* Costo */}
                <div>
                    <label className="block text-sm font-medium mb-2">Costo</label>
                    <Input
                        type="number"
                        {...register("cost", { valueAsNumber: true })}
                        onKeyDown={preventNegativeInput}
                        placeholder="Ingrese el costo"
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
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>

                {/* Imagen */}
                <div>
                    <label className="block text-sm font-medium mb-2">Imagen del producto (opcional)</label>
                    <Input
                        type="file"
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
                        disabled={isSubmitting} // Deshabilita el botón mientras se envía
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : "Agregar Vacuna"}
                    </Button>
                </div>

            </form>
        </div>
    );
}
