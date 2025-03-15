"use client";
import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/global/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { PET_API } from "@/lib/urls";

interface IPet {
  id: number;
  name: string;
  species: {
    name: string;
  };
  race: {
    name: string;
  };
  sex: string;
  profileImg?: {
    originalUrl: string;
  };
}

const IMAGE_NOT_FOUND = "/imagen-mascota/default.jpg";

// Muestra una vista en forma de Cards
const GridView = ({ pets }: { pets: IPet[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
    {pets.map((pet) => (
      <Card
        key={pet.id}
        alt={`Imagen de un/a ${pet.species.name}` || "Imagen no encontrada"}
        title={pet.name}
        image={pet.profileImg?.originalUrl || IMAGE_NOT_FOUND}
        description={`${pet.species.name} - ${pet.race.name} - ${
          pet.sex === "M" ? "Macho" : "Hembra"
        }`}
        ctaText="Ver detalles"
        ctaLink={`/detalle-mascota/${pet.id}`}
      />
    ))}
  </div>
);

// Muestra una vista en forma de Lista
const ListView = ({ pets }: { pets: IPet[] }) => (
  <div className="flex flex-col space-y-4 pb-10">
    {pets.map((pet) => (
      <div
        key={pet.id}
        className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
      >
        <Avatar className="w-16 h-16 overflow-hidden rounded-full">
          <AvatarImage
            src={pet.profileImg?.originalUrl || IMAGE_NOT_FOUND}
            alt={pet.name || "Imagen no encontrada"}
            className="object-cover"
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
        <a href={`/detalle-mascota/${pet.id}`}>
          <Button variant="outline">Ver detalles</Button>
        </a>
      </div>
    ))}
  </div>
);

// componente para la lista de mascotas
const PetList = ({ userId, token }: { userId: number; token: string }) => {
  const [isGridView, setIsGridView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pets, setPets] = useState<IPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [prevPage, setPrevPage] = useState(false);
  const [nextPage, setNextPage] = useState(false);

  // Se realiza el llamado a la API cada que se actualice userId, token y la numeración de la pág actual (currentPage)
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${PET_API}?page=${currentPage}&userId=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error al obtener mascotas");

        const jsonResponse = await response.json();

        // Esto muestra un mensaje de "Lista vacía" en caso de que el usuario no tenga Mascotas
        if (jsonResponse.total === 0)
          throw new Error("Error al obtener mascotas");

        // Actualizamos la lista de mascotas obtenidas
        setPets(jsonResponse.data);
        setTotalPages(jsonResponse.totalPages);

        // Actualizamos el estado de los botones de Next y Preview de la paginación
        setPrevPage(jsonResponse.prev);
        setNextPage(jsonResponse.next);
      } catch {
        setError("Lista vacía");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [userId, token, currentPage]);

  // Filtra la lista de mascotas en base a las coincidencias con el Input
  const filteredPets = useMemo(
    () =>
      pets.filter((pet) =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, pets]
  );

  // Se decide qué vista mostrar en base al valor de "isGridView"
  const petListView = useMemo(
    () =>
      isGridView ? (
        <GridView pets={filteredPets} />
      ) : (
        <ListView pets={filteredPets} />
      ),
    [isGridView, filteredPets]
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex-col">
      <h1 className="bg-gray-500 w-full p-4 text-3xl font-bold mb-8 text-white">
        Mis Mascotas
      </h1>
      <div className="grid px-16 gap-6">
        <div className="flex flex-col justify-around items-center gap-16 px-4 sm:flex-row ">
          <div className="flex justify-start items-center w-full gap-4">
            <Input
              className="w-full"
              type="text"
              placeholder="Busca el nombre de tu mascota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={() => setSearchTerm("")}>Limpiar</Button>
          </div>
          <div className="w-auto flex gap-2 items-center justify-end">
            <button onClick={() => setIsGridView(true)} disabled={isGridView}>
              <Grid
                className={`w-9 h-9 ${isGridView ? "text-gray-300" : ""}`}
              />
            </button>
            <button onClick={() => setIsGridView(false)} disabled={!isGridView}>
              <List
                className={`w-9 h-9 ${!isGridView ? "text-gray-300" : ""}`}
              />
            </button>
          </div>
        </div>
        <hr />
        {loading ? (
          <div className="text-center mt-8">Cargando...</div>
        ) : error ? (
          <div className="text-center mt-8">{error}</div>
        ) : (
          petListView
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
