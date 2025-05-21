"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import SearchBar from "@/components/global/SearchBar";
import type { PetData, PetDataResponse } from "@/lib/pets/IPet";
import { useFetch } from "@/hooks/api/useFetch"; 
import { PET_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
import useDebounce from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";

type PetSelectProps = {
  clientId: number;
  token: string;
  onSelectPet: (pet: PetData) => void;
};

export default function PetSelect({
  clientId,
  token,
  onSelectPet,
}: PetSelectProps) {
  const [open, setOpen] = useState(false);
  const [pets, setPets] = useState<PetData[]>([]);
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 2000);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { loading: isLoading, get } = useFetch<PetDataResponse>(PET_API, token);

  const ph = useTranslations("Placeholder");
  const b = useTranslations("Button");
  const e = useTranslations("Error");

  const fetchPets = async (search?: string) => {
    try {
      const baseUrl = `${PET_API}?page=1&clientId=${clientId}`;
      const url = search ? `${baseUrl}&name=${encodeURIComponent(search)}` : baseUrl;

      const response = await get(undefined, url);

      if (response && response.data) {
        setPets(response.data.data || []);
      }
    } catch (err) {
      if (err instanceof Error) toast("error", err.message);
    }
  };

  // Cargar mascotas al montar
  useEffect(() => {
    if (clientId && token) {
      fetchPets();
    }
  }, [clientId, token]);

  // Búsqueda con debounce
  useEffect(() => {
    if (clientId && token) {
      fetchPets(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectPet = (pet: PetData) => {
    setSelectedPet(pet);
    onSelectPet(pet);
    setOpen(false);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-11 justify-between border-myPurple-tertiary focus:ring-myPurple-primary focus:border-myPurple-primary transition-all duration-200"
          >
            {selectedPet ? (
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-start">
                {selectedPet.name}
              </div>
            ) : (
              <span className="text-muted-foreground">{ph("select")}</span>
            )}

            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 shadow-lg border-myPurple-tertiary/30 w-[var(--radix-popover-trigger-width)] max-w-[95vw]"
          align="start"
          side="bottom"
          sideOffset={5}
          avoidCollisions={false}
        >
          <Command>
            <div className="flex items-center border-b px-2 pt-2 sticky top-0 bg-white z-10">
              <div className="w-full pb-2">
                <SearchBar
                  onSearch={handleSearchChange}
                  placeholder={ph("getBy", {field: "nombre"})}
                  debounceDelay={500}
                  defaultQuery={searchQuery}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {b("loading")}
              </div>
            ) : (
              <>
                <CommandEmpty>{e("notFoundField", {field: "mascotas"})}</CommandEmpty>
                <CommandGroup>
                  <CommandList className="max-h-[250px] overflow-y-auto">
                    {pets.map((pet) => (
                      <CommandItem
                        key={pet.id}
                        value={pet.name}
                        onSelect={() => handleSelectPet(pet)}
                        className="px-4 py-2 cursor-pointer hover:bg-myPurple-disabled/50"
                      >
                        <div className="flex justify-between w-full">
                          <span className="truncate">{pet.name}</span>
                          {selectedPet?.id === pet.id && (
                            <Check className="h-4 w-4 text-myPurple-primary" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}