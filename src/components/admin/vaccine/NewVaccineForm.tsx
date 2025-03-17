"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { getManufacturers } from "@/lib/vaccine-manufacturer/getAllManufacturers";
import { getSpecies } from "@/lib/pets/getRacesAndSpecies";

interface Manufacturer {
    id: number;
    name: string;
}

interface Species {
    id: number;
    name: string;
}

export default function NewVaccineForm({ token }: { token: string | null }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [manufacturerId, setManufacturerId] = useState<number | null>(null);
    const [speciesId, setSpeciesId] = useState<number | null>(null);
    const [lot, setLot] = useState("");
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);
    const [manufacturerSearch, setManufacturerSearch] = useState("");
    const [speciesSearch, setSpeciesSearch] = useState("");
    const [isManufacturerListVisible, setIsManufacturerListVisible] = useState(false);
    const [isSpeciesListVisible, setIsSpeciesListVisible] = useState(false);

    // Cargar fabricantes y especies
    useEffect(() => {
        if (token) {
            getManufacturers(token)
                .then(setManufacturers)
                .catch((error) => {
                    console.error("Error cargando fabricantes:", error);
                    toast("error", "Error al cargar fabricantes");
                });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !manufacturerId || !speciesId || !lot) {
            toast("info", "Todos los campos son obligatorios");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vaccine`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    manufacturerId,
                    speciesId,
                    lot,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear la vacuna");
            }

            toast("success", "Vacuna creada exitosamente");
            router.push("/dashboard/vaccine");
        } catch (error) {
            toast("error", "Error al crear la vacuna");
            console.error(error);
        }
    };

    const filteredManufacturers = manufacturers.filter((manufacturer) =>
        manufacturer.name.toLowerCase().includes(manufacturerSearch.toLowerCase())
    );

    const filteredSpecies = species.filter((specie) =>
        specie.name.toLowerCase().includes(speciesSearch.toLowerCase())
    );

    return (
        <div className="p-4 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Agregar Vacuna</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ingrese un nombre"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Fabricante</label>
                    <div className="relative">
                        <Input
                            type="text"
                            value={manufacturerSearch}
                            onChange={(e) => setManufacturerSearch(e.target.value)}
                            onFocus={() => setIsManufacturerListVisible(true)}
                            onBlur={() => setTimeout(() => setIsManufacturerListVisible(false), 200)} // Retraso para permitir la selección
                            placeholder="Buscar fabricante..."
                            className="w-full mb-2"
                        />
                        {isManufacturerListVisible && (
                            <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                                {filteredManufacturers.map((manufacturer) => (
                                    <div
                                        key={manufacturer.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setManufacturerId(manufacturer.id);
                                            setManufacturerSearch(manufacturer.name);
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

                <div>
                    <label className="block text-sm font-medium mb-2">Especie</label>
                    <div className="relative">
                        <Input
                            type="text"
                            value={speciesSearch}
                            onChange={(e) => setSpeciesSearch(e.target.value)}
                            onFocus={() => setIsSpeciesListVisible(true)}
                            onBlur={() => setTimeout(() => setIsSpeciesListVisible(false), 200)} // Retraso para permitir la selección
                            placeholder="Buscar especie..."
                            className="w-full mb-2"
                        />
                        {isSpeciesListVisible && (
                            <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                                {filteredSpecies.map((specie) => (
                                    <div
                                        key={specie.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSpeciesId(specie.id);
                                            setSpeciesSearch(specie.name);
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

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/vaccine")}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit">Agregar Vacuna</Button>
                </div>
            </form>
        </div>
    );
}