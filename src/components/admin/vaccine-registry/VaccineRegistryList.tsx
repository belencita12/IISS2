"use client";

import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/SearchBar";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import { useVaccineRegistryList } from "@/hooks/vaccine-registry/useVaccineRegistryList";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import VaccineRegistryDateFilter from "./filters/VaccineRegistryDateFilter";
import GenericPagination from "@/components/global/GenericPagination";
import { getPetById } from "@/lib/pets/getPetById";

interface Props {
  token: string;
}

export default function VaccineRegistryList({ token }: Props) {
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
        item.applicationDate
          ? new Date(item.applicationDate).toLocaleDateString()
          : "—",
    },
    {
      header: "Próxima aplicación",
      accessor: (item) =>
        item.expectedDate
          ? new Date(item.expectedDate).toLocaleDateString()
          : "—",
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
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar por nombre de cliente"
        />

        <VaccineRegistryDateFilter
          label="Aplicación"
          fromKey="fromApplicationDate"
          toKey="toApplicationDate"
          filters={filters}
          setFilters={setFilters}
        />

        <VaccineRegistryDateFilter
          label="Próxima aplicación"
          fromKey="fromExpectedDate"
          toKey="toExpectedDate"
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {loading && !initialized ? (
        <p className="text-gray-500 text-center py-8">Cargando registros...</p>
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

      {!loading && initialized && (
        <GenericPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          handlePreviousPage={() =>
            pagination.currentPage > 1 &&
            handlePageChange(pagination.currentPage - 1)
          }
          handleNextPage={() =>
            pagination.currentPage < pagination.totalPages &&
            handlePageChange(pagination.currentPage + 1)
          }
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}
