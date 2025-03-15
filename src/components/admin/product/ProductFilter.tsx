"use client";

import React from "react";
import { Button } from "@/components/ui/button";

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
              onClick={() => setFilters((prev) => ({ ...prev, code: "" }))}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              ×
            </button>
          )}
        </div>
        <Button
          variant="default"
          onClick={onSearch}
          className="bg-black text-white hover:bg-gray-800"
        >
          Buscar
        </Button>
      </div>
      <div className="flex justify-between items-start mb-6">
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
              onClick={() =>
                setFilters((prev) => ({ ...prev, category: "" }))
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Precio desde:</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                }
                onKeyDown={preventInvalidKeys}
                className="border p-1 rounded w-28"
              />
              {filters.minPrice && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, minPrice: "" }))
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  ×
                </button>
              )}
            </div>
            <span className="text-sm">hasta:</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
                onKeyDown={preventInvalidKeys}
                className="border p-1 rounded w-28"
              />
              {filters.maxPrice && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, maxPrice: "" }))
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Costo desde:</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.minCost}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minCost: e.target.value }))
                }
                onKeyDown={preventInvalidKeys}
                className="border p-1 rounded w-28"
              />
              {filters.minCost && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, minCost: "" }))
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  ×
                </button>
              )}
            </div>
            <span className="text-sm">hasta:</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.maxCost}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxCost: e.target.value }))
                }
                onKeyDown={preventInvalidKeys}
                className="border p-1 rounded w-28"
              />
              {filters.maxCost && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, maxCost: "" }))
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
