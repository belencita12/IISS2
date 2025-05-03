"use client";

import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useDebounce from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/api";

type EntitySearchProps<T> = {
  token: string;
  entityName: string;
  apiUrl: string;
  onSelect: (item: T) => void;
  getItemLabel: (item: T) => string;
  getItemKey: (item: T) => string | number;
};

export function EntitySearch<T>({
  token,
  entityName,
  apiUrl,
  onSelect,
  getItemLabel,
  getItemKey,
}: EntitySearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data, get, loading } = useFetch<{ data: T[] }>("", token);

  useEffect(() => {
    if (debouncedSearch) {
      get(undefined, `${apiUrl}?query=${encodeURIComponent(debouncedSearch)}&page=1&size=5`);
      setIsCommandOpen(true);
    } else {
      setIsCommandOpen(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (data?.data) {
      setItems(data.data);
    }
  }, [data]);

  const handleSelect = (item: T) => {
    setSearchTerm("");
    onSelect(item);
    setIsCommandOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Buscar ${entityName}...`}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isCommandOpen && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1">
            <Command className="rounded-lg border shadow-md">
              <CommandList>
                <CommandEmpty>
                  {loading ? "Cargando..." : `No se encontraron ${entityName}s.`}
                </CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={getItemKey(item)}
                      onSelect={() => handleSelect(item)}
                      className="cursor-pointer"
                    >
                      {getItemLabel(item)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
}
