"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { getRaces } from "@/lib/pets/getRaces";
import { PetData, Race } from "@/lib/pets/IPet";
import { toast } from 'sonner';

interface PetsListProps {
    userId: number;
    token: string;
}

export const PetsList = ({ userId, token }: PetsListProps) => {
    const [pets, setPets] = useState<PetData[]>([]);
    const [races, setRaces] = useState<Race[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPetsAndRaces = async () => {
            try {
                const fetchedPets = await getPetsByUserId(userId, token);
                setPets(fetchedPets);

                const fetchedRaces = await getRaces(token);
                setRaces(fetchedRaces);
            } catch {
                toast.error("Error al obtener mascotas o razas:");
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) {
            fetchPetsAndRaces();
        }
    }, [userId, token]);

    // Función para calcular la edad en años y meses
    const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return "";

        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (today.getDate() < birthDate.getDate()) {
            months--;
        }

        if (months < 0) {
            years--;
            months += 12;
        }
        if (years === 0 && months === 0) return "";
        if (years === 0) return `${months} meses`;
        if (months === 0) return `${years} años`;
        return `${years} años y ${months} meses`;
    };

    // Función para generar avatar con iniciales
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <section className="max-w-5xl mx-auto mt-10 p-6 bg-white flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold mt-2 text-center">Tus Mascotas Registradas</h3>
            <p className="text-gray-500 mt-2 text-center">Administra la información de tus mascotas</p>
            <Button variant="outline" className="border border-black mt-4">
                <Link href="/pet/register">Agregar Mascota</Link>
            </Button>

            {loading ? (
                <p className="mt-4 text-gray-500">Cargando mascotas...</p>
            ) : pets.length === 0 ? (
                <p className="mt-4 text-gray-500">No tienes mascotas registradas.</p>
            ) : (
                <div className="mt-8 w-full max-w-[57rem]">
                    <ScrollArea className="w-full overflow-x-auto" type="always">
                        <div className="flex items-center gap-6 mt-2 w-max">
                            {pets.map((pet, index) => {
                                const ageText = calculateAge(pet.dateOfBirth);
                                return (
                                    <div key={index} className="text-center w-48 flex-shrink-0">
                                        <Avatar className="w-24 h-24 mx-auto bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">
                                            {pet.profileImg ? (
                                                <img
                                                    src={pet.profileImg}
                                                    alt={pet.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <span>{getInitials(pet.name)}</span>
                                            )}
                                        </Avatar>
                                        <p className="font-semibold mt-2 text-lg">{pet.name}</p>
                                        <p className="text-sm text-gray-500">
                                        {races.find(r => r.id === pet.raceId)?.name || "Raza desconocida"}
                                        </p>
                                        {ageText && <p className="font-bold mt-2">{ageText}</p>}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="h-4"></div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            )}
        </section>
    );
};
