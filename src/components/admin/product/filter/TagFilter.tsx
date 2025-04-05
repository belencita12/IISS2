"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useGetTags } from "@/hooks/tags/useGetTags";
import { useState, useEffect } from "react";

interface TagFilterProps {
  title?: string;
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
  className?: string;
  token: string;
}

export function TagFilter({
  title = "Tags",
  selectedTags,
  onChange,
  className,
  token,
}: TagFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading, setQuery } = useGetTags({ token });

  useEffect(() => {
    setQuery((prev) => ({ ...prev, name: searchQuery }));
  }, [searchQuery, setQuery]);

  const options =
    data?.data?.map((tag) => ({
      id: tag.id.toString(),
      label: tag.name,
    })) || [];

  const toggleTag = (tagName: string) => {
    const updatedTags = selectedTags.includes(tagName)
      ? selectedTags.filter((name) => name !== tagName)
      : [...selectedTags, tagName];

    onChange(updatedTags);
  };

  const clearTags = () => {
    onChange([]);
    setSearchQuery("");
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className={cn("w-full max-w-[180px] relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full p-2 text-sm rounded flex items-center justify-between",
              className
            )}
          >
            <span className="truncate">{title}</span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <CommandInput
                placeholder="Buscar"
                className="border-0 focus:ring-0"
                onValueChange={handleSearchChange}
                value={searchQuery}
              />
            </div>
            {isLoading ? (
              <div className="p-3 text-center">Cargando...</div>
            ) : (
              <>
                <CommandEmpty>Etiqueta no encontrada.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {options.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.label}
                        onSelect={() => toggleTag(option.label)}
                        className="flex items-center space-x-2 px-4 py-2"
                      >
                        <Checkbox
                          id={`tag-${option.label}`}
                          checked={selectedTags.includes(option.label)}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              toggleTag(option.label);
                            }
                          }}
                          className="h-4 w-4"
                          aria-label={`Seleccionar ${option.label}`}
                        />
                        <span>{option.label}</span>
                        {selectedTags.includes(option.label) && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <button
          onClick={clearTags}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}