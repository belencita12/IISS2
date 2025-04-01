"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../../components/global/Card";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PetData } from "@/lib/pets/IPet";
import { useRouter } from "next/navigation";
import { getPetsByNameAndUserIdFull } from "@/lib/pets/getPetsByUserId";
import { toast } from "@/lib/toast";
import SearchBar from "../global/SearchBar";
import GenericPagination from "../global/GenericPagination";
import PetsGridSkeleton from "./skeleton/PetsGridSkeleton";
import PetsListSkeleton from "./skeleton/PetsListSkeleton";

const IMAGE_NOT_FOUND = "/imagen-mascota/default.jpg";

// componente para la lista de mascotas
const PetList = ({ clientId, token }: { clientId: number; token: string }) => {
  const router = useRouter();
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda de mascotas por nombre "en la barra de búsqueda"
  const [petName, setPetName] = useState(""); // Estado para la búsqueda de mascotas por nombre "en la paginación"
  const [pets, setPets] = useState<PetData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Función para obtener las mascotas de la API
  const fetchPets = async (page: number, query: string) => {
    setLoading(true);
    try {
      const trimmedQuery = query.trim();

      const response = await getPetsByNameAndUserIdFull(
        clientId,
        token,
        page,
        trimmedQuery
      );

      // Esto muestra un mensaje de "Lista vacía" si el usuario no tiene Mascotas
      setIsEmpty(response.total === 0);

      // Actualizamos la lista de mascotas obtenidas
      setPets(response.data);

      // Actualizamos el total de páginas
      setTotalPages(response.totalPages);
    } catch {
      toast("error", "Error al obtener mascotas");
    } finally {
      setLoading(false);
    }
  };

  // Buscar mascotas al cargar la página
  useEffect(() => {
    fetchPets(1, "");
  }, []);

  // Función para buscar mascotas por nombre desde la barra de búsqueda
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPetName(query);
    setCurrentPage(1);
    await fetchPets(1, query);
  };

  // Buscar mascotas por nombre desde la paginación (cuando se clickee en los botones de paginación)
  useEffect(() => {
    fetchPets(currentPage, petName);
  }, [currentPage]);

  return (
    <div className="flex-col">
      <h1 className="bg-gray-500 w-full p-4 text-3xl font-bold mb-8 text-white px-16">
        Mis Mascotas
      </h1>
      <div className="grid px-16 gap-6">
        <div className="flex flex-col justify-around items-start gap-6 md:gap-16 px-4 sm:flex-row mb-6">
          <div className="w-full">
            <SearchBar
              onSearch={handleSearch}
              manualSearch={true}
              defaultQuery={searchQuery}
              placeholder="Busca el nombre de tu mascota..."
            />
          </div>
          <div className="w-auto flex gap-2 items-center justify-end">
            <button
              onClick={() => setIsGridView(true)}
              disabled={isLoading || isEmpty || isGridView}
            >
              <Grid
                className={`w-9 h-9 ${
                  isLoading || isEmpty || isGridView ? "text-gray-300" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              disabled={isLoading || isEmpty || !isGridView}
            >
              <List
                className={`w-9 h-9 ${
                  isLoading || isEmpty || !isGridView ? "text-gray-300" : ""
                }`}
              />
            </button>
          </div>
        </div>
        {isLoading ? (
          isGridView ? (
            <PetsGridSkeleton />
          ) : (
            <PetsListSkeleton />
          )
        ) : isEmpty ? (
          <div className="text-center my-8">No hay mascotas</div>
        ) : isGridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {pets.map((pet) => (
              <Card
                key={pet.id}
                alt={
                  `Imagen de un/a ${pet.species.name}` || "Imagen no encontrada"
                }
                title={pet.name}
                image={pet.profileImg?.originalUrl || IMAGE_NOT_FOUND}
                bgColor="hover:bg-gray-50 transition h-full"
                description={`${pet.species.name} - ${pet.race.name} - ${
                  pet.sex === "M" ? "Macho" : "Hembra"
                }`}
              >
                <Button
                  className="w-full"
                  size={"lg"}
                  variant="outline"
                  onClick={() => {
                    router.push(`../pet/${pet.id}`);
                  }}
                >
                  Ver detalles
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-4 pb-10">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center md:mx-20 gap-4 p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                <Avatar className="w-16 h-16 overflow-hidden rounded-full">
                  <AvatarImage
                    className="w-full h-full object-cover"
                    src={pet.profileImg?.previewUrl || IMAGE_NOT_FOUND}
                    alt={pet.name || "Imagen no encontrada"}
                  />
                  <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{pet.name}</h3>
                  <p className="text-gray-600">
                    {pet.species.name} - {pet.race.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pet.sex === "M" ? "Macho" : "Hembra"}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    router.push(`../pet/${pet.id}`);
                  }}
                  variant="outline"
                >
                  Ver detalles
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      {!isLoading ? (
        <GenericPagination
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageChange={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default PetList;
