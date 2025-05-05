"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { PetData } from "@/lib/pets/IPet";
import { toast } from "@/lib/toast";
import Image from "next/image";
import { List, Plus } from "lucide-react";
import { RecommendedProducts } from "./Product";

interface PetsListProps {
  clientId: number;
  token: string;
}

export const PetsList = ({ clientId, token }: PetsListProps) => {
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const fetchedPets = await getPetsByUserId(clientId, token);
        setPets(fetchedPets);
      } catch {
        toast("error", "Error al obtener mascotas");
      } finally {
        setLoading(false);
      }
    };

    if (clientId && token) fetchPets();
  }, [clientId, token]);

  const calculateAge = (dateOfBirth: string): string => {
    if (!dateOfBirth) return "";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) months--;
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years < 1) return `${months} mes${months !== 1 ? "es" : ""}`;
    return `${years} año${years !== 1 ? "s" : ""}`;
  };

  return (
    <>
      <section className="max-w-5xl mx-auto mt-10 bg-white text-center">
        <h3 className="text-3xl font-bold mt-2 text-purple-600">Mascotas Registradas</h3>
        <p className="text-gray-500 mt-2 text-sm">Administra la información de tus mascotas</p>

        <div className="flex gap-4 mt-4 justify-center flex-wrap">
          <Link href="/user-profile/pet/register">
            <Button className="bg-pink-500 text-white flex items-center gap-2 hover:bg-pink-600">
              <Plus className="w-5 h-5" />
              Agregar Mascota
            </Button>
          </Link>
          <Link href="/user-profile/pet/list-pets">
            <Button className="bg-white text-pink-500 border border-pink-500 flex items-center gap-2 hover:bg-pink-600 hover:text-white">
              <List className="w-5 h-5" />
              Ver lista de mascotas
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="mt-4 text-gray-500">Cargando mascotas...</p>
        ) : pets.length === 0 ? (
          <p className="mt-4 text-gray-500">No tienes mascotas registradas.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-32 justify-items-center">
            {pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/user-profile/pet/${pet.id}`}
                className="flex flex-col w-[260px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white text-gray-900"
              >
                <div className="relative w-full h-[180px] flex items-center justify-center bg-gray-100">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200">
                    {pet.profileImg?.originalUrl ? (
                      <Image
                        src={pet.profileImg.originalUrl}
                        alt={pet.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                        priority
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-xl font-bold text-gray-700">
                        {pet.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1 overflow-hidden">
                  <div className="flex flex-col space-y-2 overflow-hidden">
                    <h3 className="text-lg font-semibold line-clamp-2 text-purple-600">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {pet.race?.name || "Raza desconocida"}
                    </p>
                    {pet.dateOfBirth && (
                      <div className="flex flex-wrap justify-center gap-1 mt-1">
                        <span className="bg-white text-pink-500 text-xs font-medium px-2 py-0.5 rounded-full border border-gray-200">
                          {calculateAge(pet.dateOfBirth)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Render RecommendedProducts solo si hay mascotas */}
      {!loading && pets.length > 0 && (
        <RecommendedProducts 
          clientId={clientId} 
          token={token} 
          pets={pets} 
        />
      )}
    </>
  );
};