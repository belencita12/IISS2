import React, { useState } from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel";

interface CategoryFilterProps {
  category: string;
  onCategoryChange: (category: string) => void;
  onClearCategory: () => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  category,
  onCategoryChange,
  onClearCategory,
}) => {
  const [open, setOpen] = useState(false);


  return (
    <div className="relative w-full max-w-[180px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full p-2 text-sm rounded flex items-center justify-between"
          >
            <span className="truncate">
            {category ? getCategoryLabel(category) : "Categoría"}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandGroup>
              <CommandList>
                <CommandItem
                  onSelect={() => {
                    onCategoryChange("");
                    setOpen(false);
                  }}
                  className="px-4 py-2"
                >
                  Ninguno
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    onCategoryChange("PRODUCT");
                    setOpen(false);
                  }}
                  className="px-4 py-2"
                >
                  Producto
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    onCategoryChange("VACCINE");
                    setOpen(false);
                  }}
                  className="px-4 py-2"
                >
                  Vacuna
                </CommandItem>
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>


      {category !== "" && (
        <button
          onClick={onClearCategory}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};