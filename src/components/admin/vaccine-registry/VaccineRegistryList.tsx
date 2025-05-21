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
import { getPetById } from "@/lib/pets/getPetById";
import { formatDate } from "@/lib/utils";
import VaccineRegistryListSkeleton from "./skeleton/VaccineRegistryListSkeleton";

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
          label="Aplicada"
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
