import { useState, useEffect } from "react";

interface Filters {
  code: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minCost: string;
  maxCost: string;
  tags: string[]; // Aseguramos que es string[]
}

export const useProductFilters = (
  initialFilters: Filters,
  onSearch: () => void,
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
) => {
  const [searchInput, setSearchInput] = useState(initialFilters.code);
  const [localCodeValue, setLocalCodeValue] = useState(initialFilters.code);

  // Sincroniza el estado interno con el filtro global
  useEffect(() => {
    setSearchInput(initialFilters.code);
    setLocalCodeValue(initialFilters.code);
  }, [initialFilters.code]);

  const clearFilter = (filterName: keyof Filters) => {
    if (filterName === "code") {
      setLocalCodeValue("");
      setSearchInput("");
    }
    setFilters((prev) => ({
      ...prev,
      [filterName]: filterName === "tags" ? [] as string[] : "",
    }));
    if (filterName === "code") {
      onSearch();
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      code: localCodeValue,
    }));
    onSearch();
  };

  return {
    searchInput,
    setSearchInput,
    localCodeValue,
    setLocalCodeValue,
    clearFilter,
    handleSearch,
  };
};