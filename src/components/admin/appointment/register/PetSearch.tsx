"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PetData } from "@/lib/pets/IPet";
import { PET_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api";
import useDebounce from "@/hooks/useDebounce";

type PetSelectProps = {
  onSelectPet: (pet: PetData) => void;
  token: string;
};

type PetResponse = {
  data: PetData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};

export default function PetSearch({
  onSelectPet,
  token,
}: PetSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [pets, setPets] = useState<PetData[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, get, loading } = useFetch<PetResponse>("", token);

  useEffect(() => {
    if (debouncedSearch) {
      get(undefined, `${PET_API}?name=${encodeURIComponent(debouncedSearch)}&page=1&size=5`);
      setIsCommandOpen(true);
    } else {
      setIsCommandOpen(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (data?.data) {
      setPets(data.data);
    }
  }, [data]);

  const handleSelectPet = (pet: PetData) => {
    setSearchTerm("");
    onSelectPet(pet);
    setIsCommandOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar Mascota..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {isCommandOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1">
              <Command className="rounded-lg border shadow-md">
                <CommandList>
                  <CommandEmpty>
                    {loading ? "Cargando..." : "No se encontraron mascotas."}
                  </CommandEmpty>
                  <CommandGroup>
                    {pets.map((pet) => (
                      <CommandItem
                        key={pet.id}
                        onSelect={() => handleSelectPet(pet)}
                        className="cursor-pointer"
                      >
                        <div>
                          <p>{pet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Dueño: {pet.owner.name}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>

        <Link
          href={"/dashboard/clients"}
          target="_blank"
          className="flex items-center justify-center rounded-md border border-muted bg-muted p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
