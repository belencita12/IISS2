"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash } from "lucide-react";
import { usePaginatedFetch } from "@/hooks/api";
import { PET_API } from "@/lib/urls";
import { ListPetData } from "@/lib/pets/IPet";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import PetsTableSkeleton from "@/components/admin/settings/pets/skeleton/PetsTableSkeleton";
import { toast } from "@/lib/toast";
import { PetFilters } from "./PetsFilters";
import { deletePet } from "@/lib/pets/deletePet";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { Button } from "@/components/ui/button";
import { getPetReport } from "@/lib/pets/getPetReport";
import ExportButton from "@/components/global/ExportButton";
import { downloadFromBlob } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ListPetsProps {
  token: string;
}

export default function ListPets({ token }: ListPetsProps) {
  const router = useRouter();
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(
    null
  );
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGettingReport, setIsGettingReport] = useState(false);
  const [petToDelete, setPetToDelete] = useState<ListPetData | null>(null);
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [resetCounter, setResetCounter] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);

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
    if (error instanceof Error) {
      toast("error", error.message);
    }
  }, [error]);

  const handleSetFromDate = (from: string | undefined) => {
    setFrom(from);
    search({
      name: searchQuery,
      clientName: clientSearchQuery,
      to: to ? new Date(to).toISOString() : undefined,
      from: from ? new Date(from).toISOString() : undefined,
      ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
      ...(selectedRaceId ? { raceId: selectedRaceId } : {}),
    });
  };

  const handleSetToDate = (to: string | undefined) => {
    setTo(to);
    search({
      name: searchQuery,
      clientName: clientSearchQuery,
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(to).toISOString() : undefined,
      ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
      ...(selectedRaceId ? { raceId: selectedRaceId } : {}),
    });
  };

  const handleGetPetReport = async () => {
    if (!from || !to) {
      toast("error", t("error.errorLimitDate"));
    } else {
      setIsGettingReport(true);
      const result = await getPetReport({
        speciesId: selectedSpeciesId ?? undefined,
        token,
        from,
        to,
      });
      if (!(result instanceof Blob)) toast("error", result.message);
      else downloadFromBlob(result);
      setIsGettingReport(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!petToDelete) return;
    try {
      await deletePet(token, petToDelete.id);
      toast("success", t("success.successDeletePet"));
      setIsDeleteModalOpen(false);
      setPetToDelete(null);
      search({
        name: searchQuery,
        clientName: clientSearchQuery,
        to: to ? new Date(to).toISOString() : undefined,
        from: from ? new Date(from).toISOString() : undefined,
        ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
        ...(selectedRaceId ? { raceId: selectedRaceId } : {}),
      });
    } catch (error: unknown) {
      if (error instanceof Error)
      toast("error", error.message);
      setIsDeleteModalOpen(false);
    }
  };

  //búsqueda por nombre de mascota)
  const handlePetSearch = (query: string) => {
    setSearchQuery(query);
    search({
      name: query,
      clientName: clientSearchQuery,
      to: to ? new Date(to).toISOString() : undefined,
      from: from ? new Date(from).toISOString() : undefined,
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
      to: to ? new Date(to).toISOString() : undefined,
      from: from ? new Date(from).toISOString() : undefined,
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
      to: to ? new Date(to).toISOString() : undefined,
      from: from ? new Date(from).toISOString() : undefined,
      clientName: clientSearchQuery,
      ...(speciesId ? { speciesId } : {}),
    });
  };

  // Manejador para filtrar por raza
  const handleRaceFilter = (raceId: number | null) => {
    setSelectedRaceId(raceId);
    search({
      name: searchQuery,
      to: to ? new Date(to).toISOString() : undefined,
      from: from ? new Date(from).toISOString() : undefined,
      clientName: clientSearchQuery,
      ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
      ...(raceId ? { raceId } : {}),
    });
  };

  const actions: TableAction<ListPetData>[] = [
    {
      icon: <Eye size={18} />,
      label: t("button.seeDetails"),
      onClick: (pet) => {
        if (!pet.owner?.id || !pet.id) {
          toast("error", t("error.notAccessDetails"));
          return;
        }
        router.push(`/dashboard/clients/${pet.owner.id}/pet/${pet.id}`);
      },
    },
    {
      icon: <Pencil size={18} />,
      label: t("button.edit"),
      onClick: (pet) => {
        if (!pet.owner?.id || !pet.id) {
          toast("error", t("error.errorUpdatePet"));
          return;
        }
        router.push(`/dashboard/clients/${pet.owner.id}/pet/${pet.id}/edit`);
      },
    },
    {
      icon: <Trash size={18} />,
      label: t("button.delete"),
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
          (<div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={pet.profileImg?.previewUrl || "/NotImageNicoPets.png"}
              alt={pet.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>),
      className: "w-12",
    },

    { header: t("pet.details.name"), accessor: "name" },
    { header: t("pet.details.owner"), accessor: (pet) => pet.owner?.name },
    { header: t("pet.details.specie"), accessor: (pet) => pet.species.name },
    { header: t("pet.details.race"), accessor: (pet) => pet.race.name },
  ];

  const hasActiveFilters = !!(
    from ||
    to ||
    searchQuery ||
    clientSearchQuery ||
    selectedRaceId ||
    selectedSpeciesId
  );

  const resetFilters = () => {
    setIsFiltering(true)
    setFrom(undefined)
    setTo(undefined)
    setSelectedRaceId(null)
    setSelectedSpeciesId(null)
    handleClientSearch("")
    handlePetSearch("")
    setResetCounter((prev) => prev + 1);
    setIsFiltering(false)
  };

  return (
    <div className="space-y-4">
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resetFilters()}
            className="text-sm h-8 px-2 text-gray-600 mt-[20px] mb-[-10px]"
            disabled={isFiltering}
          >
          Limpiar filtros
          </Button>
        </div>
      )}
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
        to={to}
        from={from}
        setDateTo={handleSetToDate}
        setDateFrom={handleSetFromDate}
        reset={resetCounter}
      />
      <div className="flex justify-between mr-5">
        <h1 className="text-2xl font-bold">{t("pet.title")}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isGettingReport}
            className="disabled:opacity-75"
            onClick={() => router.push("/dashboard/settings/pets/register")}
          >
            {t("button.register")}
          </Button>
          <ExportButton
            handleGetReport={handleGetPetReport}
            isLoading={isGettingReport}
          />
        </div>
      </div>
      <GenericTable<ListPetData>
        data={pets || []}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t("pet.table.emptyMessage")}
        skeleton={<PetsTableSkeleton />}
        className="w-full"
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t("confirmationModal.pet.titleDelete")}
        message={t("confirmationModal.pet.messageDelete", {pet: petToDelete?.name ?? ""})}
        confirmText={t("button.delete")}
        cancelText={t("button.cancel")}
        variant="danger"
      />
    </div>
  );
}
