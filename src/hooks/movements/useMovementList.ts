import { useState, useEffect, useCallback } from "react";
import { getMovements } from "@/lib/movements/getMovements";
import { fetchEmployees } from "@/lib/employee/getEmployees";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { GetMovementQueryParams, MovementData } from "@/lib/movements/IMovements";
import { PaginationResponse } from "@/lib/types";
import { useQuery } from "../useQuery";

interface UseMovementListProps {
  token: string;
  init?: GetMovementQueryParams & { managerRuc?: string };
}

export const useMovementList = ({ token, init }: UseMovementListProps) => {
  const [data, setData] = useState<PaginationResponse<MovementData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { query, setQuery } = useQuery(init);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      let managerIds: number[] = [];

      // Paso 1: Buscar empleados si se filtra por RUC
      if (query.managerRuc) {
        const empRes = await fetchEmployees(1, query.managerRuc, token);
        managerIds = empRes.data?.map((emp: EmployeeData) => emp.id) || [];

        if (managerIds.length === 0) {
          setData({
            data: [],
            total: 0,
            size: 0,
            prev: false,
            next: false,
            currentPage: 1,
            totalPages: 1,
          });
          setLoading(false);
          return;
        }
      }

      // Paso 2: Crear URLSearchParams manualmente SIN managerRuc
      const queryParams = new URLSearchParams(
        Object.entries(query)
          .filter(([key, value]) => key !== "managerRuc" && value !== undefined && value !== "")
          .map(([key, value]) => [key, String(value)])
      );

      // Paso 3: Agregar managerIds como filtros (puede ser múltiples)
      if (managerIds.length > 0) {
        managerIds.forEach((id) => queryParams.append("managerId", id.toString()));
      }

      // Mostrar la URL completa que se enviará
      console.log("🔍 Query final:", queryParams.toString());

      // Paso 4: Obtener movimientos
      const result = await getMovements(token, queryParams.toString());
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Error al obtener movimientos");
    } finally {
      setLoading(false);
    }
  }, [token, query]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  return {
    data,
    isLoading: loading,
    error,
    query,
    setQuery,
    handleSearch: fetchMovements,
  };
};
