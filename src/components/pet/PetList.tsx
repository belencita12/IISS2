"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../../components/global/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Grid, List, Trash } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { PetData } from "@/lib/pets/IPet";
import { useRouter } from "next/navigation";
import { getPetsByNameAndUserIdFull } from "@/lib/pets/getPetsByUserId";
import { toast } from "@/lib/toast";

const IMAGE_NOT_FOUND = "/imagen-mascota/default.jpg";

// componente para la lista de mascotas
const PetList = ({ userId, token }: { userId: number; token: string }) => {
  const router = useRouter();
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda de mascotas por nombre
  const [petName, setPetName] = useState(""); // Estado para el nombre de mascota cuando se carga la página y cuando se cambia la paginación
  const [pets, setPets] = useState<PetData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [prevPage, setPrevPage] = useState(false);
  const [nextPage, setNextPage] = useState(false);

  // Se realiza el llamado a la API cada que se actualice userId, token y la numeración de la pág actual (currentPage)
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const response = await getPetsByNameAndUserIdFull(
          userId,
          token,
          currentPage,
          petName
        );

        // Esto muestra un mensaje de "Lista vacía" si el usuario no tiene Mascotas
        if (response.total === 0) setEmptyMessage("Lista vacía");

        // Actualizamos la lista de mascotas obtenidas
        setPets(response.data);

        // Actualizamos el total de páginas
        setTotalPages(response.totalPages);

        // Actualizamos el estado de los botones de Next y Preview de la paginación
        setPrevPage(response.prev);
        setNextPage(response.next);
      } catch {
        toast("error", "Error al obtener mascotas");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [userId, token, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Función para buscar mascotas por nombre
  const handleSearch = async () => {
    setIsSearching(true);

    // Si no hay nada en searchQuery, se muestra un mensaje de error
    const trimmedQuery = searchQuery.trim();

    try {
      const response = await getPetsByNameAndUserIdFull(
        userId,
        token,
        1,
        trimmedQuery
      );

      response.total === 0
        ? setEmptyMessage("Lista vacía")
        : setEmptyMessage("");

      // Establecemos los valores del trimmedQuery a petName (usado al cargar la página y al cambiar la paginación)
      setPetName(trimmedQuery);

      // Actualizamos la lista de mascotas obtenidas
      setPets(response.data);

      // Actualizamos el total de páginas
      setTotalPages(response.totalPages);

      // Actualizamos el estado de los botones de Next y Preview de la paginación
      setPrevPage(response.prev);
      setNextPage(response.next);
    } catch {
      toast("error", "Error al buscar mascotas");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-col">
      <h1 className="bg-gray-500 w-full p-4 text-3xl font-bold mb-8 text-white px-16">
        Mis Mascotas
      </h1>
      <div className="grid px-16 gap-6">
        <div className="flex flex-col justify-around items-center gap-16 px-4 sm:flex-row ">
          <div className="flex justify-start items-center w-full gap-4">
            <div className="relative w-full flex flex-row items-center gap-4">
              <Input
                className="w-full"
                type="text"
                placeholder="Busca el nombre de tu mascota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchQuery("")}
                >
                  <Trash className="w-6 h-6" />
                </button>
              )}
            </div>
            <Button disabled={isLoading || isSearching} onClick={handleSearch}>
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
          <div className="w-auto flex gap-2 items-center justify-end">
            <button
              onClick={() => setIsGridView(true)}
              disabled={isLoading || isGridView}
            >
              <Grid
                className={`w-9 h-9 ${
                  isLoading || isGridView ? "text-gray-300" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              disabled={isLoading || !isGridView}
            >
              <List
                className={`w-9 h-9 ${
                  isLoading || !isGridView ? "text-gray-300" : ""
                }`}
              />
            </button>
          </div>
        </div>
        <hr />
        {isLoading ? (
          <div className="text-center mt-8">Cargando...</div>
        ) : emptyMessage ? (
          <div className="text-center mt-8">{emptyMessage}</div>
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
                bgColor="bg-gray-200 h-full"
                description={`${pet.species.name} - ${pet.race.name} - ${
                  pet.sex === "M" ? "Macho" : "Hembra"
                }`}
                ctaText="Ver detalles"
                ctaLink={`/detalle-mascota/${pet.id}`}
              >
                <Button
                  className="w-full"
                  size={"lg"}
                  variant="outline"
                  onClick={() => {
                    router.push(`/detalle-mascota/${pet.id}`);
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
                    router.push(`/detalle-mascota/${pet.id}`);
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
      <Pagination className="pt-6 pb-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={handlePreviousPage}
              className={!prevPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "font-bold bg-gray-200" : ""}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={handleNextPage}
              className={!nextPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PetList;
