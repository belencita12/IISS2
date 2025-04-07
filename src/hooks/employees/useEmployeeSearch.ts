// hooks/employees/useEmployeeSearch.ts

import { useState } from "react";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { fetchEmployees } from "@/lib/employee/getEmployees"; // <--- cambiar import

export const useEmployeeSearch = (token: string) => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchEmployees = async (query: string) => {
    if (!query) return;

    setIsLoading(true);
    try {
      const data = await fetchEmployees(1, query, token); // <--- usamos page 1 fijo
      setEmployees(data.data || []); // <--- asumiendo backend devuelve { content: [...] }
      setHasSearched(true);
    } catch (error) {
      console.error("Error buscando empleados", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setEmployees([]);
    setHasSearched(false);
  };

  return {
    employees,
    isLoading,
    hasSearched,
    searchEmployees,
    resetSearch,
  };
};
