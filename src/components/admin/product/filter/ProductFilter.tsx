"use client"; 

import React from "react";
import SearchBar from "@/components/global/SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { NumericFilter } from "./NumericFilter";
import { TagFilter } from "@/components/admin/product/filter/TagFilter";
import { useProductFilters } from "@/hooks/product/useProductFilter";

interface ProductFiltersProps {
  filters: {
    searchTerm: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    minCost: string;
    maxCost: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      searchTerm: string;
      category: string;
      minPrice: string;
      maxPrice: string;
      minCost: string;
      maxCost: string;
    }>
  >;
  onSearch: () => void;
  preventInvalidKeys: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  selectedTags: string[];
  onTagsChange: (selectedTags: string[]) => void;
  token: string;
}

export default function ProductFilters({
  filters,
  setFilters,
  onSearch,
  preventInvalidKeys,
  selectedTags,
  onTagsChange,
  token,
}: ProductFiltersProps) {
  const { searchInput, setSearchInput, clearFilter } = useProductFilters(
    filters,
    onSearch,
    setFilters
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full sm:flex-row gap-2">
        <SearchBar
          onSearch={(query) => {
            setSearchInput(query);
            setFilters((prev) => ({ ...prev, searchTerm: query }));
          }}
          defaultQuery={searchInput}
          debounceDelay={400}
          placeholder="Buscar por código o nombre del producto"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-20 mb-4 relative w-full">
        <CategoryFilter
          category={filters.category}
          onCategoryChange={(category) =>
            setFilters((prev) => ({ ...prev, category }))
          }
          onClearCategory={() => clearFilter("category")}
        />

        <TagFilter
          title="Etiqueta"
          selectedTags={selectedTags}
          onChange={onTagsChange}
          token={token}
        />

        <div className="flex items-center gap-5 ml-auto">
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