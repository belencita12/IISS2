"use client";

import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/SearchBar";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import { useVaccineRegistryList, VaccineRegistryFilters } from "@/hooks/vaccine-registry/useVaccineRegistryList";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import VaccineRegistryDateFilter from "./filters/VaccineRegistryDateFilter";
import { getPetById } from "@/lib/pets/getPetById";
import { formatDate } from "@/lib/utils";
import VaccineRegistryListSkeleton from "./skeleton/VaccineRegistryListSkeleton";
import { useState } from "react";

interface Props {
  token: string;
}

export default function VaccineRegistryList({ token }: Props) {
  const [isFiltering, setIsFiltering] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const router = useRouter();

  const {
    registries,
    pagination,
    loading,
    handleSearch,
    handlePageChange,
    filters,
    setFilters,
    initialized,
    pendingUpdate,
  } = useVaccineRegistryList(token);

  const columns: Column<VaccineRecord>[] = [
    {
      header: "Cliente",
      accessor: (item) => item.pet?.client?.user?.fullName ?? "—",
    },
    { header: "Mascota", accessor: (item) => item.pet?.name ?? "—" },
    { header: "Vacuna", accessor: (item) => item.vaccine?.name ?? "—" },
    {
      header: "Aplicación",
      accessor: (item) =>
        item.applicationDate ? formatDate(item.applicationDate) : "—",
    },
    {
      header: "Próxima aplicación",
      accessor: (item) =>
        item.expectedDate ? formatDate(item.expectedDate) : "—",
    },
  ];

  const actions: TableAction<VaccineRecord>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "Ver",
      onClick: (r) =>
        router.push(`/dashboard/settings/vaccine-registry/${r.id}`),
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      label: "Editar",
      //espero no me odien por esto xd
      onClick: async (r) => {
        try {
          const pet = await getPetById(Number(r.petId), token);
          const clientId = pet?.owner?.id;

          if (clientId && pet.id) {
            router.push(`/dashboard/clients/${clientId}/pet/${pet.id}/${r.id}`);
          } else {
            router.push(`/dashboard/settings/vaccine-registry/${r.id}/edit`);
          }
        } catch {
          router.push(`/dashboard/settings/vaccine-registry/${r.id}/edit`);
        }
      },
    },
  ];

  const hasActiveFilters = !!(
      filters.clientName ||
      filters.fromApplicationDate ||
      filters.toApplicationDate ||
      filters.fromExpectedDate ||
      filters.toExpectedDate
    );
  
    const resetFilters = () => {
      setIsFiltering(true)
      const cleanFilters: VaccineRegistryFilters = {
        clientName:"",
        fromApplicationDate:"",
        toApplicationDate:"",
        fromExpectedDate:"",
        toExpectedDate:""
      };
      setFilters(cleanFilters);
      setIsFiltering(false)
      setResetCounter((prev) => prev + 1);
    };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">Historial de vacunación</h2>
        </div>
        <Button
          onClick={() =>
            router.push("/dashboard/settings/vaccine-registry/new")
          }
        >
          Nuevo registro
        </Button>
      </div>

      <div className="space-y-4 mb-4">
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
            variant="ghost"
            size="sm"
            onClick={() => resetFilters()}
            className="text-sm h-8 px-2 text-gray-600 mr-[10px]"
            disabled={isFiltering}
            >
            Limpiar filtros
            </Button>
          </div>
        )}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar por nombre de cliente"
          resetTrigger={resetCounter}
        />

        <VaccineRegistryDateFilter
          label="Aplicada"
          fromKey="fromApplicationDate"
          toKey="toApplicationDate"
          filters={filters}
          setFilters={setFilters}
          resetTrigger={resetCounter}
        />

        <VaccineRegistryDateFilter
          label="Próxima aplicación"
          fromKey="fromExpectedDate"
          toKey="toExpectedDate"
          filters={filters}
          setFilters={setFilters}
          resetTrigger={resetCounter}
        />
      </div>

      {(loading || pendingUpdate) && !initialized ? (
        <VaccineRegistryListSkeleton />
      ) : (
        <GenericTable
          data={registries}
          columns={columns}
          actions={actions}
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={loading}
          emptyMessage="No se encontraron registros"
        />
      )}
    </div>
  );
}
