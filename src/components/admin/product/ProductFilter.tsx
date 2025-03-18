"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  onSearch: (updatedFilters?: {
    code: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    minCost: string;
    maxCost: string;
  }) => void;
  preventInvalidKeys: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function ProductFilters({
  filters,
  setFilters,
  onSearch,
  preventInvalidKeys,
}: ProductFiltersProps) {
  // Función auxiliar para limpiar un filtro sin disparar búsqueda
  const clearFilter = (filterName: keyof typeof filters) => {
    const updatedFilters = {
      ...filters,
      [filterName]: "",
    };
    setFilters(updatedFilters);
    onSearch(updatedFilters); // Ejecuta la búsqueda con el filtro limpio
  };
  

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por código del producto"
            value={filters.code}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, code: e.target.value }))
            }
            className="border p-2 rounded w-full"
          />
          {filters.code && (
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
          onClick={() => onSearch(filters)}
          className="bg-black text-white hover:bg-gray-800"
        >
          Buscar
        </Button>
      </div>
      <div className="flex items-center mb-6 relative w-full">
        {/* Filtro de categoría */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                category: e.target.value === "none" ? "" : e.target.value,
              }))
            }
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
        <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
          <span className="text-sm">Precio</span>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Desde"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
              }
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
              step="0.01"
              placeholder="Hasta"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
              }
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
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm">Costo</span>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
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
              step="0.01"
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
