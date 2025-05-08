import { useCallback, useEffect, useState } from "react";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PaginationInfo } from "@/components/global/GenericTable";
import { getAllVaccineRegistries } from "@/lib/vaccine-registry/getAllVaccinesRegistry";
import { toast } from "@/lib/toast";

export interface VaccineRegistryFilters {
  clientName?: string;
  vaccineId?: string;
  dose?: string;
  fromApplicationDate?: string;
  toApplicationDate?: string;
  fromExpectedDate?: string;
  toExpectedDate?: string;
  [key: string]: unknown;
}

export const useVaccineRegistryList = (token: string) => {
  const [registries, setRegistries] = useState<VaccineRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<VaccineRegistryFilters>({});
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(false);


  const fetchData = useCallback(
    async (page: number, activeFilters: VaccineRegistryFilters) => {
      setLoading(true);
      try {
        const result = await getAllVaccineRegistries(
          token,
          page,
          pagination.pageSize,
          activeFilters as Record<string, string>
        );

        setRegistries(result.data);
       setPagination({
          currentPage: result.currentPage || 1,
          totalPages: result.totalPages || 1,
          totalItems: result.total || 0,
          pageSize: result.size || 10,
        });
        setInitialized(true);
      } catch {
        toast("error", "Error al cargar registros de vacunación");
      } finally {
        setLoading(false);
      }
    },
    [token, pagination.pageSize]
  );

  useEffect(() => {
    setPendingUpdate(true);
    fetchData(1, filters).then(() => {
      setPendingUpdate(false);
    });
  }, [fetchData, filters]);
  

  const handleSearch = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      clientName: query,
    }));
  };

  const handlePageChange = (page: number) => {
    fetchData(page, filters);
  };

  return {
    registries,
    pagination,
    loading,
    filters,
    setFilters,
    handleSearch,
    handlePageChange,
    initialized,
    pendingUpdate
  };
};
