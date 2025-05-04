import { useCallback, useEffect, useState } from "react";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { PaginationInfo } from "@/components/global/GenericTable";
import { getAllVaccineRegistries } from "@/lib/vaccine-registry/getAllVaccinesRegistry";
import { getPetById } from "@/lib/pets/getPetById";
import { fetchUsers } from "@/lib/client/getUsers";
import { toast } from "@/lib/toast";

export const useVaccineRegistryList = (token: string) => {
  const [registries, setRegistries] = useState<(VaccineRecord & { pet?: PetData; clientName?: string })[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(
    async (page = 1, filters = {}) => {
      setLoading(true);
      try {
        const result = await getAllVaccineRegistries(token, page, pagination.pageSize, filters);
        const sorted = result.data.sort((a, b) =>
          new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime()
        );

        const clientData = await fetchUsers(1, "", token);
        const clientMap = new Map<number, IUserProfile>(
          (clientData.data as IUserProfile[]).map((client) => [client.id, client])
        );

        const enriched = await Promise.all(
          sorted.map(async (record) => {
            const pet = await getPetById(Number(record.petId), token);
            const client = pet?.owner?.id ? clientMap.get(Number(pet.owner.id)) : undefined;

            return {
              ...record,
              pet: pet ?? undefined,
              clientName: client?.fullName ?? "—",
            };
          })
        );

        setRegistries(enriched);
        setPagination({
          currentPage: result.currentPage || 1,
          totalPages: result.totalPages || 1,
          totalItems: result.total || 0,
          pageSize: result.size || 10,
        });
      } catch {
        toast("error", "Error al cargar registros de vacunación");
      } finally {
        setLoading(false);
      }
    },
    [token, pagination.pageSize]
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

  return {
    registries,
    pagination,
    loading,
    handleSearch,
    handlePageChange,
  };
};
