"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../../components/global/Card";
import { Button } from "@/components/ui/button";
import { Grid, List, PawPrint } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative bg-gradient-to-r from-myPurple-primary to-myPink-primary py-8 mb-8">
        <div className="container mx-auto px-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PawPrint className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Mis Mascotas</h1>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-myPurple-secondary to-myPink-secondary opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-16">
        <div className="flex flex-col justify-around items-start gap-6 md:gap-16 px-4 sm:flex-row mb-6">
          <div className="w-full">
            <SearchBar
              onSearch={handleSearch}
              defaultQuery={searchQuery}
              placeholder="Busca el nombre de tu mascota..."
            />
          </div>
          <div className="w-auto flex gap-2 items-center justify-end">
            <Button
              variant="ghost"
              size={"default"}
              onClick={() => setIsGridView(true)}
              disabled={isLoading || isEmpty || isGridView}
              className={`${isGridView ? 'bg-gray-100' : ''} hover:bg-gray-100 w-12 h-12 p-0 [&_svg]:!w-8 [&_svg]:!h-8`}
            >
              <Grid className={isLoading || isEmpty || isGridView ? "text-gray-300" : "text-myPurple-primary"} />
            </Button>
            <Button
              variant="ghost"
              size={"default"}
              onClick={() => setIsGridView(false)}
              disabled={isLoading || isEmpty || !isGridView}
              className={`${!isGridView ? 'bg-gray-100' : ''} hover:bg-gray-100 w-12 h-12 p-0 [&_svg]:!w-8 [&_svg]:!h-8`}
            >
              <List className={isLoading || isEmpty || !isGridView ? "text-gray-300" : "text-myPurple-primary"} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          isGridView ? (
            <PetsGridSkeleton />
          ) : (
            <PetsListSkeleton />
          )
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <PawPrint className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No hay mascotas registradas</p>
            <p className="text-sm">Comienza agregando una nueva mascota</p>
          </div>
        ) : isGridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {pets.map((pet) => (
              <Card
                key={pet.id}
                title={pet.name}
                description={`${pet.species.name} • ${pet.race.name} • ${pet.sex === "M" ? "Macho" : "Hembra"}`}
                image={pet.profileImg?.originalUrl || IMAGE_NOT_FOUND}
                alt={`Imagen de un/a ${pet.species.name}`}
                imagePosition="top"
                layout="vertical"
                bgColor="bg-white flex flex-col h-full"
                textColor="text-gray-800"
                imageWidth={400}
                imageHeight={400}
              >
                <div className="mt-auto pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-myPurple-primary to-myPink-primary hover:from-myPurple-hover hover:to-myPink-hover text-white"
                    onClick={() => router.push(`../pet/${pet.id}`)}
                  >
                    Ver detalles
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-4 pb-10">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Avatar className="w-16 h-16 ring-2 ring-myPurple-primary/20">
                  <AvatarImage
                    className="object-cover"
                    src={pet.profileImg?.previewUrl || IMAGE_NOT_FOUND}
                    alt={pet.name || "Imagen no encontrada"}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-myPurple-primary to-myPink-primary text-white">
                    {pet.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
                  <p className="text-gray-600">
                    {pet.species.name} • {pet.race.name}
                  </p>
                  <p className="text-sm text-myPurple-primary font-medium">
                    {pet.sex === "M" ? "Macho" : "Hembra"}
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`../pet/${pet.id}`)}
                  className="bg-gradient-to-r from-myPurple-primary to-myPink-primary hover:from-myPurple-hover hover:to-myPink-hover text-white"
                >
                  Ver detalles
                </Button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isEmpty && (
          <div className="py-8">
            <GenericPagination
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              handlePageChange={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PetList;
