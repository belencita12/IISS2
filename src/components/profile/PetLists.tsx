"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { PetData } from "@/lib/pets/IPet";
import Image from "next/image";
import { List, Plus } from "lucide-react";
import { RecommendedProducts } from "./RecommendedProducts";
import PetListsSkeleton from "./skeleton/PetListsSkeleton";
import { ProductSkeleton } from "./skeleton/ProductSkeleton";
import { useTranslations } from "next-intl";

interface PetsListProps {
  clientId: number;
  token: string;
  onFetchError?: (error: string) => void;
}

export const PetsList = ({ clientId, token, onFetchError }: PetsListProps) => {
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const t = useTranslations("PetLists");
  const b = useTranslations("Button");
  const e = useTranslations("Error");
  const defaultImageSrc = "/NotImageNicoPets.png";

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const fetchedPets = await getPetsByUserId(clientId, token);
        setPets(fetchedPets);
      } catch (error) {
        const errorMessage = "Error al obtener mascotas";
        onFetchError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && token) fetchPets();
  }, [clientId, token, onFetchError]);

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
      <section className="w-full mt-10 bg-white text-center px-4">
        <h3 className="text-3xl font-bold mt-2 text-purple-600">
          {t("pets")}
        </h3>
        <p className="text-gray-500 mt-2 text-sm">
          {t("petsDescription")}
        </p>

        <div className="flex gap-4 mt-4 justify-center flex-wrap">
          <Link href="/user-profile/pet/register">
            <Button className="bg-pink-500 text-white flex items-center gap-2 hover:bg-pink-600">
              <Plus className="w-5 h-5" />
              {b("add")}
            </Button>
          </Link>
          <Link href="/user-profile/pet/list-pets">
            <Button className="bg-white text-pink-500 border border-pink-500 flex items-center gap-2 hover:bg-pink-600 hover:text-white">
              <List className="w-5 h-5" />
              {t("petListBtn")}
            </Button>
          </Link>
        </div>

        {loading ? (
          <PetListsSkeleton />
        ) : pets.length === 0 ? (
          <p className="mt-4 text-gray-500">{e("notFoundPets")}</p>
        ) : (
          <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
            {pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/user-profile/pet/${pet.id}`}
                className="flex flex-col w-full max-w-[260px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white text-gray-900"
              >
                <div className="relative w-full h-[180px] flex items-center justify-center bg-gray-100">
                  <div className="w-40 h-40 relative overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src={pet.profileImg?.originalUrl || defaultImageSrc}
                      alt={pet.name}
                      fill
                      style={{ objectFit: "cover" }}
                      priority
                    />
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
        <h2 className="text-3xl font-bold text-purple-600 mt-20">
          {t("vetProducts")}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          {t("exploreProducts")}
        </p>
        <Button className="bg-white text-pink-500 border border-pink-500 mt-3 hover:bg-pink-600 hover:text-white">
          <Link href="/shop">{t("seeMore")}</Link>
        </Button>
      </section>

      {!loading && pets.length > 0 && (
        <RecommendedProducts clientId={clientId} token={token} pets={pets} />
      )}
      {loading && <ProductSkeleton />}
    </>
  );
};