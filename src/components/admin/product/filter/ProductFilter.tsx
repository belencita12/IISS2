
"use client";

import React from "react";
import SearchBar from "@/components/global/SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { NumericFilter } from "./NumericFilter";
import { useProductFilters } from "@/hooks/product/useProductFilter";

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
  const { searchInput, setSearchInput, clearFilter } = useProductFilters(
    filters,
    onSearch,
    setFilters
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full sm:flex-row gap-4 mb-4">
      <SearchBar
        onSearch={(query) => {
          setSearchInput(query);
          setFilters((prev) => ({ ...prev, code: query }));
        }}
        defaultQuery={searchInput}
        manualSearch={true}
        debounceDelay={400}
        placeholder="Buscar por código del producto"
      />

      </div>

      <div className="flex flex-col sm:flex-row items-center mb-6 relative w-full">
        <CategoryFilter
          category={filters.category}
          onCategoryChange={(category) =>
            setFilters((prev) => ({ ...prev, category }))
          }
          onClearCategory={() => clearFilter("category")}
        />

        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
          <NumericFilter
            label="Precio"
            minValue={filters.minPrice}
            maxValue={filters.maxPrice}
            onMinChange={(minPrice) =>
              setFilters((prev) => ({ ...prev, minPrice }))
            }
            onMaxChange={(maxPrice) =>
              setFilters((prev) => ({ ...prev, maxPrice }))
            }
            onClearMin={() => clearFilter("minPrice")}
            onClearMax={() => clearFilter("maxPrice")}
            preventInvalidKeys={preventInvalidKeys}
          />
        </div>
          <div className="sm:ml-auto">
            <NumericFilter
              label="Costo"
              minValue={filters.minCost}
              maxValue={filters.maxCost}
              onMinChange={(minCost) =>
                setFilters((prev) => ({ ...prev, minCost }))
              }
              onMaxChange={(maxCost) =>
                setFilters((prev) => ({ ...prev, maxCost }))
              }
              onClearMin={() => clearFilter("minCost")}
              onClearMax={() => clearFilter("maxCost")}
              preventInvalidKeys={preventInvalidKeys}
            />
          </div>
      </div>
    </div>
  );
}
