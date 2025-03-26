"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SearchBar from "@/components/global/SearchBar";

interface ProductFiltersProps {
  filters: {
    code: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    minCost: string;
    maxCost: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      code: string;
      category: string;
      minPrice: string;
      maxPrice: string;
      minCost: string;
      maxCost: string;
    }>
  >;
  onSearch: () => void;
  preventInvalidKeys: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function ProductFilters({
  filters,
  setFilters,
  onSearch,
  preventInvalidKeys,
}: ProductFiltersProps) {
  // Estado local para el campo de código que no activa la búsqueda automática
  //const [localCodeValue, setLocalCodeValue] = useState(filters.code);
  const [searchInput, setSearchInput] = useState(filters.code);


  // Función auxiliar para limpiar un filtro
  const clearFilter = (filterName: keyof typeof filters) => {
    /*if (filterName === "code") {
      setLocalCodeValue("");
      setFilters((prev) => ({
        ...prev,
        [filterName]: "",
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterName]: "",
      }));
    }*/

    if (filterName === "code") {
      setFilters((prev) => ({
        ...prev,
        [filterName]: "",
      }));
      onSearch(); // ✅ dispara la búsqueda limpia cuando se borra el código
    }

  };


  // Manejar el evento de tecla "Enter" en el input de código
  /*const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Actualizar el filtro real y ejecutar la búsqueda al presionar Enter
      handleSearch();
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = () => {
    // Actualizar el valor real del filtro de código antes de buscar
    setFilters((prev) => ({
      ...prev,
      code: localCodeValue,
    }));

    // Ejecutar la búsqueda
    onSearch();
  };*/

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Fila superior: input de búsqueda y botón "Buscar" */}
      <div className="flex flex-col w-full sm:flex-row gap-4 mb-4">
        {/*<div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por código del producto"
            value={localCodeValue}
            onChange={(e) => setLocalCodeValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border p-2 rounded w-full"
          />
          {localCodeValue && (
            <button
              onClick={() => clearFilter("code")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant="default"
          onClick={handleSearch}
          className="bg-black text-white hover:bg-gray-800"
        >
          Buscar
        </Button>*/}

        <SearchBar
          onSearch={(query) => {
            setSearchInput(query); // mantenerlo actualizado localmente
            setFilters((prev) => ({ ...prev, code: query }));
            onSearch(); // dispara la búsqueda desde el padre
          }}
          defaultQuery={searchInput}
          manualSearch={true}
          debounceDelay={400}
          placeholder="Buscar por código del producto"
        />
      </div>

      {/* Fila inferior: filtros de categoría, precio y costo */}
      <div className="flex flex-col sm:flex-row items-center mb-6 relative w-full">
        {/* Filtro de categoría */}
        <div className="relative">
          <select
            title="type"
            value={filters.category}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                category: e.target.value === "none" ? "" : e.target.value,
              }));
            }}
            className="border p-2 rounded w-40"
          >
            <option value="" disabled hidden>
              Categoria
            </option>
            <option value="none">Ninguno</option>
            <option value="PRODUCT">Producto</option>
            <option value="VACCINE">Vacuna</option>
          </select>
          {filters.category !== "" && (
            <button
              onClick={() => clearFilter("category")}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros de precio */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
          <span className="text-sm">Precio</span>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Desde"
              value={filters.minPrice}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, minPrice: e.target.value }));
              }}
              onKeyDown={preventInvalidKeys}
              className="border p-1 rounded w-28"
            />
            {filters.minPrice && (
              <button
                onClick={() => clearFilter("minPrice")}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="text-sm">-</span>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Hasta"
              value={filters.maxPrice}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, maxPrice: e.target.value }));
              }}
              onKeyDown={preventInvalidKeys}
              className="border p-1 rounded w-28"
            />
            {filters.maxPrice && (
              <button
                onClick={() => clearFilter("maxPrice")}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Filtros de costo */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0 sm:ml-auto">
          <span className="text-sm">Costo</span>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Desde"
              value={filters.minCost}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minCost: e.target.value }))
              }
              onKeyDown={preventInvalidKeys}
              className="border p-1 rounded w-28"
            />
            {filters.minCost && (
              <button
                onClick={() => clearFilter("minCost")}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="text-sm">-</span>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Hasta"
              value={filters.maxCost}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxCost: e.target.value }))
              }
              onKeyDown={preventInvalidKeys}
              className="border p-1 rounded w-28"
            />
            {filters.maxCost && (
              <button
                onClick={() => clearFilter("maxCost")}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}