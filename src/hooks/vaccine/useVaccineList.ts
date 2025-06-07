import { useState, useCallback } from "react";
import { getVaccines } from "@/lib/vaccine/getVaccines";
import { IVaccine } from "@/lib/vaccine/IVaccine";
import { PaginationInfo } from "@/components/global/GenericTable";
import { toast } from "@/lib/toast";

export const useVaccineList = (token: string | null) => {
  const [data, setData] = useState<{
    vaccines: IVaccine[];
    pagination: PaginationInfo;
  }>({
    vaccines: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 4 },
  });

  const [loading, setLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [lastManufacturerId, setLastManufacturerId] = useState<number | null>(null);

  const loadVaccines = useCallback(
    async (
      page: number = 1,
      filters: { name?: string; manufacturerId?: number } = {}
    ) => {
      if (!token) return;
      setLoading(true);
      try {
        const results = await getVaccines(token, page, filters);
        if (!Array.isArray(results.data)) throw new Error("La respuesta de la API no es un array");

        setData({
          vaccines: results.data,
          pagination: {
            currentPage: results.currentPage || 1,
            totalPages: results.totalPages || 1,
            totalItems: results.total || 0,
            pageSize: results.size || 4,
          },
        });
      } catch (error:unknown) {
        if (error instanceof Error)
        toast("error", error.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const handleSearch = useCallback(
    async (query: string, manufacturerId?: number) => {
      if (!token) return;
      setLoading(true);
      setLastSearch(query);
      setLastManufacturerId(manufacturerId ?? null);
      try {
        const result = await getVaccines(token, 1, {
          name: query,
          manufacturerId,
        });
        setData({
          vaccines: result.data,
          pagination: {
            currentPage: result.currentPage || 1,
            totalPages: result.totalPages || 1,
            totalItems: result.total || 0,
            pageSize: result.size || 4,
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error)
        toast("error", error.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const handlePageChange = (page: number) => {
    loadVaccines(page, {
      name: lastSearch,
      manufacturerId: lastManufacturerId ?? undefined,
    });
  };

  return {
    data,
    loading,
    lastSearch,
    setLastSearch,
    lastManufacturerId,
    setLastManufacturerId,
    loadVaccines,
    handleSearch,
    handlePageChange,
  };
};
