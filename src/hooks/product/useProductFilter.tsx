import { useState, useEffect } from "react";

interface Filters {
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minCost: string;
  maxCost: string;
}

export const useProductFilters = (
  initialFilters: Filters,
  onSearch: () => void,
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
) => {
  const [searchInput, setSearchInput] = useState(initialFilters.searchTerm);
  const [localSearchValue, setLocalSearchValue] = useState(initialFilters.searchTerm);

  // Sincroniza el estado interno con el filtro global
  useEffect(() => {
    setSearchInput(initialFilters.searchTerm);
    setLocalSearchValue(initialFilters.searchTerm);
  }, [initialFilters.searchTerm]);

  const clearFilter = (filterName: keyof Filters) => {
    if (filterName === "searchTerm") {
      setLocalSearchValue("");
      setSearchInput("");
    }
    setFilters((prev) => ({
      ...prev,
      [filterName]: "",
    }));
    if (filterName === "searchTerm") {
      onSearch();
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: localSearchValue,
    }));
    onSearch();
  };

  return {
    searchInput,
    setSearchInput,
    localSearchValue,
    setLocalSearchValue,
    clearFilter,
    handleSearch,
  };
};