"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/SearchBar";
import GenericTable, {
  Column,
  TableAction,
  PaginationInfo,
} from "@/components/global/GenericTable";
import { toast } from "@/lib/toast";
import { getAllVaccineRegistries } from "@/lib/vaccine-registry/getAllVaccinesRegistry";
import { getPetById } from "@/lib/pets/getPetById";
import { fetchUsers } from "@/lib/client/getUsers"
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";
import { IUserProfile } from "@/lib/client/IUserProfile";

interface Props {
  token: string;
}

export default function VaccineRegistryList({ token }: Props) {
  const router = useRouter();

  const [data, setData] = useState<{
    registries: (VaccineRecord & { pet?: PetData; clientName?: string })[];
    pagination: PaginationInfo;
  }>({
    registries: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10,
    },
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(
    async (page: number = 1, filters = {}) => {
      setLoading(true);
      try {
        const result = await getAllVaccineRegistries(
          token,
          page,
          data.pagination.pageSize,
          filters
        );
  
        const sorted = result.data.sort(
          (a, b) =>
            new Date(a.expectedDate).getTime() -
            new Date(b.expectedDate).getTime()
        );
  
        // 🔁 Una sola llamada para obtener todos los usuarios (clientes)
        const clientData = await fetchUsers(1, "", token);
        const clientMap = new Map<number, IUserProfile>(
          (clientData.data as IUserProfile[]).map((client) => [client.id, client])
        );
  
        const enriched = await Promise.all(
          sorted.map(async (record) => {
            const pet = await getPetById(record.petId, token);
            const client = pet?.userId ? clientMap.get(pet.userId) : undefined;
  
            return {
              ...record,
              pet: pet ?? undefined,
              clientName: client?.fullName ?? "—",
            };
          })
        );
  
        setData({
          registries: enriched,
          pagination: {
            currentPage: result.currentPage || 1,
            totalPages: result.totalPages || 1,
            totalItems: result.total || 0,
            pageSize: result.size || 10,
          },
        });
      } catch {
        toast("error", "Error al cargar registros de vacunación");
      } finally {
        setLoading(false);
      }
    },
    [token, data.pagination.pageSize]
  );
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (query: string) => {
    setSearch(query);
    fetchData(1, { search: query });
  };

  const handlePageChange = (page: number) => {
    fetchData(page, { search });
  };

  const columns: Column<(VaccineRecord & { pet?: PetData; clientName?: string })>[] = [
    {
      header: "Mascota",
      accessor: (item) => item.pet?.name ?? "—",
    },
    {
      header: "Cliente",
      accessor: (item) => item.clientName ?? "—",
    },
    {
      header: "Vacuna",
      accessor: (item) => item.vaccine?.name ?? "—",
    },
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
      onClick: (r) =>
        router.push(`/dashboard/settings/vaccine-registry/${r.id}/edit`),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col"> 
            <h2 className="text-3xl font-bold">Historial de vacunación</h2>
            <h4>Página secreta en construcción por diversión :)</h4>
        </div>        
        <Button
          onClick={() =>
            router.push("/dashboard/settings/vaccine-registry/register")
          }
        >
          Nuevo registro
        </Button>
      </div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Buscar por nombre de mascota o cliente"
        debounceDelay={400}
      />

      <GenericTable
        data={data.registries}
        columns={columns}
        actions={actions}
        pagination={data.pagination}
        onPageChange={handlePageChange}
        isLoading={loading}
        emptyMessage="No se encontraron registros"
      />
    </div>
  );
}