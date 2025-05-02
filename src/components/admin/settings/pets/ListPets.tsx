"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedFetch } from "@/hooks/api";
import { PET_API } from "@/lib/urls";
import { ListPetData } from "@/lib/pets/IPet";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import PetsTableSkeleton from "@/components/admin/settings/pets/skeleton/PetsTableSkeleton";
import { toast } from "@/lib/toast";
import { PetFilters } from "./PetFilters";
import { deletePet } from "@/lib/pets/deletePet";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";

interface ListPetsProps {
  token: string;
}

export default function ListPets({ token }: ListPetsProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(
    null
  );
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<ListPetData | null>(null);

  const {
    data: pets,
    loading: isLoading,
    error,
    pagination,
    setPage,
    search,
  } = usePaginatedFetch<ListPetData>(PET_API, token, {
    initialPage: 1,
    size: 16,
    autoFetch: true,
  });

  useEffect(() => {
    if (error) {
      toast("error", "Error al cargar las mascotas: ${error.message}");
    }
  }, [error]);

  const handleConfirmDelete = async () => {
    if (!petToDelete) return;
    try {
      await deletePet(token, petToDelete.id);
      toast("success", "Mascota eliminada correctamente");
      setIsDeleteModalOpen(false);
      setPetToDelete(null);
      search({
        name: searchQuery,
        clientName: clientSearchQuery,
        ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
        ...(selectedRaceId ? { raceId: selectedRaceId } : {}),
      });
    } catch (error) {
      toast("error", "Ocurrió un error al eliminar la mascota");
      setIsDeleteModalOpen(false);
    }
  };

  //búsqueda por nombre de mascota)
  const handlePetSearch = (query: string) => {
    setSearchQuery(query);
    search({
      name: query,
      clientName: clientSearchQuery,
      ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
      ...(selectedRaceId ? { raceId: selectedRaceId } : {}),
    });
  };

  // Manejador para la búsqueda por nombre de cliente
  const handleClientSearch = (query: string) => {
    setClientSearchQuery(query);
    search({
      name: searchQuery,
      clientName: query,
      ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
      ...(selectedRaceId ? { raceId: selectedRaceId } : {}),
    });
  };

  // Manejador para filtrar por especie
  const handleSpeciesFilter = (speciesId: number | null) => {
    setSelectedSpeciesId(speciesId);
    // Al cambiar la especie, resetear la raza seleccionada
    setSelectedRaceId(null);
    search({
      name: searchQuery,
      clientName: clientSearchQuery,
      ...(speciesId ? { speciesId } : {}),
    });
  };

  // Manejador para filtrar por raza
  const handleRaceFilter = (raceId: number | null) => {
    setSelectedRaceId(raceId);
    search({
      name: searchQuery,
      clientName: clientSearchQuery,
      ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
      ...(raceId ? { raceId } : {}),
    });
  };

  const actions: TableAction<ListPetData>[] = [
    {
      icon: <Eye size={18} />,
      label: "Ver detalle",
      onClick: (pet) => {
        if (!pet.owner?.id || !pet.id) {
          toast("error", "No se puede acceder al detalle de esta mascota.");
          return;
        }
        router.push(`/dashboard/clients/${pet.owner.id}/pet/${pet.id}`);
      },
    },
    {
      icon: <Pencil size={18} />,
      label: "Editar",
      onClick: (pet) => {
        if (!pet.owner?.id || !pet.id) {
          toast("error", "No se puede editar esta mascota.");
          return;
        }
        router.push(`/dashboard/clients/${pet.owner.id}/pet/${pet.id}/edit`);
      },
    },
    {
      icon: <Trash size={18} />,
      label: "Eliminar",
      onClick: (pet) => {
        setPetToDelete(pet);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const columns: Column<ListPetData>[] = [
    {
      header: "",
      accessor: (pet) =>
        pet.profileImg ? (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={pet.profileImg.previewUrl}
              alt={pet.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <Skeleton className="w-10 h-10 rounded-full" />
        ),
      className: "w-12",
    },

    { header: "Nombre", accessor: "name" },
    { header: "Cliente", accessor: (pet) => pet.owner?.name || "No asignado" },
    { header: "Especie", accessor: (pet) => pet.species.name },
    { header: "Raza", accessor: (pet) => pet.race.name },
  ];

  return (
    <div className="space-y-4">
      <PetFilters
        token={token}
        onPetSearch={handlePetSearch}
        onClientSearch={handleClientSearch}
        onSpeciesFilter={handleSpeciesFilter}
        onRaceFilter={handleRaceFilter}
        petSearchQuery={searchQuery}
        clientSearchQuery={clientSearchQuery}
        selectedSpeciesId={selectedSpeciesId}
        selectedRaceId={selectedRaceId}
      />
      <h1 className="text-2xl font-bold">Lista de Mascotas</h1>
      <GenericTable<ListPetData>
        data={pets || []}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No hay mascotas registradas"
        skeleton={<PetsTableSkeleton />}
        className="w-full"
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Mascota"
        message={`¿Seguro que quieres eliminar a ${petToDelete?.name}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
