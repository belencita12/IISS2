'use client';

import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/SearchBar";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";
import { useVaccineRegistryList } from "@/hooks/vaccine-registry/useVaccineRegistryList";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";

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
  } = useVaccineRegistryList(token);

  const columns: Column<(VaccineRecord & { pet?: PetData; clientName?: string })>[] = [
    { header: "Mascota", accessor: (item) => item.pet?.name ?? "—" },
    { header: "Cliente", accessor: (item) => item.clientName ?? "—" },
    { header: "Vacuna", accessor: (item) => item.vaccine?.name ?? "—" },
    {
      header: "Aplicación",
      accessor: (item) =>
        item.applicationDate ? new Date(item.applicationDate).toLocaleDateString() : "—",
    },
    {
      header: "Próxima aplicación",
      accessor: (item) =>
        item.expectedDate ? new Date(item.expectedDate).toLocaleDateString() : "—",
    },
  ];

  const actions: TableAction<(VaccineRecord & { pet?: PetData })>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "Ver",
      onClick: (r) => router.push(`/dashboard/settings/vaccine-registry/${r.id}`),
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      label: "Editar",
      onClick: (r) => {
        if (r.pet?.id && r.pet.owner?.id) {
          router.push(`/dashboard/clients/${r.pet.owner.id}/pet/${r.pet.id}/${r.id}`);
        } else {
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
        <Button onClick={() => router.push("/dashboard/settings/vaccine-registry/new")}>
          Nuevo registro
        </Button>
      </div>

      {/* <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre de mascota o cliente" debounceDelay={400} /> */}

      <GenericTable
        data={registries}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={handlePageChange}
        isLoading={loading}
        emptyMessage="No se encontraron registros"
      />
    </div>
  );
}
