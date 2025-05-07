import { useCallback, useEffect, useState } from "react";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";
import { PaginationInfo } from "@/components/global/GenericTable";
import { getAllVaccineRegistries } from "@/lib/vaccine-registry/getAllVaccinesRegistry";
import { getPetById } from "@/lib/pets/getPetById";
import { getClientById } from "@/lib/client/getClientById"; // ✅ Import nuevo
import { toast } from "@/lib/toast";

export interface VaccineRegistryFilters {
  clientName?: string;
  vaccineId?: string;
  dose?: string;
  from?: string;
  to?: string;
  fromExpectedDate?: string;
  toExpectedDate?: string;
  [key: string]: unknown;
}

export const useVaccineRegistryList = (token: string) => {
  const [registries, setRegistries] = useState<(VaccineRecord & { pet?: PetData; clientName?: string })[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<VaccineRegistryFilters>({});
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (page = 1, activeFilters: VaccineRegistryFilters = filters) => {
      setLoading(true);
      try {
        const result = await getAllVaccineRegistries(token, page, pagination.pageSize, activeFilters as Record<string, string>);

        const enriched = await Promise.all(
          result.data.map(async (record) => {
            const pet = await getPetById(Number(record.petId), token);
            const clientId = pet?.owner?.id;

            let clientName = "—";
            if (clientId) {
              const client = await getClientById(clientId, token);
              clientName = client?.fullName ?? "—";
            }

            return {
              ...record,
              pet: pet ?? undefined,
              clientName,
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
    [token, pagination.pageSize, filters]
  );

  useEffect(() => {
    fetchData(1, filters);
  }, [fetchData, filters]);

  const handleSearch = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      clientName: query,
    }));
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  return {
    registries,
    pagination,
    loading,
    filters,
    setFilters,
    handleSearch,
    handlePageChange,
  };
};
