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
import { useTranslations } from "next-intl";
import { SelectValue } from "@radix-ui/react-select";

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
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { loading: isLoading, get } = useFetch<PetDataResponse>(PET_API, token);

  const ph = useTranslations("Placeholder");
  const fetchPets = async (search?: string) => {
    try {
      const baseUrl = `${PET_API}?page=1&clientId=${clientId}`;
      const url = search ? `${baseUrl}&name=${search}` : baseUrl;

      const response = await get(undefined, url);

      if (response && response.data) {
        setPets(response.data.data || []);
      }
    } catch (err) {
      toast("error", "Error al cargar mascotas");
    }
  };

  useEffect(() => {
    if (clientId && token) {
      fetchPets();
    }
  }, [clientId, token]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    fetchPets(query);
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
              <SelectValue placeholder={ph("select")} />
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
                  placeholder="Buscar por nombre..."
                  debounceDelay={500}
                  defaultQuery={searchQuery}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Cargando mascotas...
              </div>
            ) : (
              <>
                <CommandEmpty>No se encontraron mascotas</CommandEmpty>
                <CommandGroup>
                  <CommandList className="max-h-[250px] overflow-y-auto">
                    {pets.map((pet) => (
                      <CommandItem
                        key={pet.id}
                        value={pet.name}
                        onSelect={() => handleSelectPet(pet)}
                        className="px-4 py-2 cursor-pointer hover:bg-myPurple-disabled/50"
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex items-center w-full">
                            <span className="font-medium truncate">{pet.name}</span>
                            {selectedPet?.id === pet.id && (
                              <Check className="ml-auto h-4 w-4 text-myPurple-primary" />
                            )}
                          </div>
                          {pet.race?.name && (
                            <span className="text-sm text-muted-foreground truncate">
                              {pet.race.name}
                            </span>
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