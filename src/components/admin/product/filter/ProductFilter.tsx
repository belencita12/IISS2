"use client";

import React from "react";
import { Tag, X } from "lucide-react";
import SearchBar from "@/components/global/SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { NumericFilter } from "./NumericFilter";
import { TagFilter } from "@/components/admin/product/filter/TagFilter";
import { useProductFilters } from "@/hooks/product/useProductFilter";
import { useTranslations } from "next-intl";

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

  const f = useTranslations("Filters");
  const ph= useTranslations("Placeholder");
  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <div className="w-full sm:w-[70%]">
          <SearchBar
            onSearch={(query) => {
              setSearchInput(query);
              setFilters((prev) => ({ ...prev, searchTerm: query }));
            }}
            defaultQuery={searchInput}
            debounceDelay={400}
            placeholder={ph("getBy", {field: "código o nombre del producto"})}
          />
        </div>
        <div className="w-full sm:w-[30%]">
          <CategoryFilter
            category={filters.category}
            onCategoryChange={(category) =>
              setFilters((prev) => ({ ...prev, category }))
            }
            onClearCategory={() => clearFilter("category")}
          />
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-4 mb-5">
        <div className="w-full sm:w-1/2">
          <NumericFilter
            label={ph("price")}
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
        <div className="w-full sm:w-1/2">
          <NumericFilter
            label={ph("cost")}
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
      <div className="flex flex-col sm:flex-row sm:gap-4 w-full">
        <div className="w-full sm:w-[24%]">
          <TagFilter
            title={f("tag")}
            selectedTags={selectedTags}
            onChange={onTagsChange}
            token={token}
          />
        </div>
        <div className="w-full sm:w-[74%]">
          {selectedTags.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-blue-50 border border-blue-100 text-black text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors hover:bg-blue-100"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-gray text-black hover:bg-blue-300 transition-colors"
                      aria-label={`Eliminar etiqueta ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}