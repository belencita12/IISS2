"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart2 } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";
import { STOCK_API } from "@/lib/urls";
import { useDebounce } from "@/hooks/product/useDebounce";

interface Stock {
  id: number;
  name: string;
  address: string;
}

interface StockResponse {
  data: Stock[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

interface DepositSearchProps {
  onSelectDeposit: (depositId: string) => void;
  value?: string;
  token: string;
  error?: string;
}

export default function DepositSearch({
  onSelectDeposit,
  value,
  token,
  error,
}: DepositSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deposits, setDeposits] = useState<Stock[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Stock | null>(null); // 💡 Nuevo estado

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, get, loading } = useFetch<StockResponse>("", token);

  useEffect(() => {
    if (debouncedSearch) {
      get(undefined, `${STOCK_API}?name=${encodeURIComponent(debouncedSearch)}&page=1&size=20`);
      setIsCommandOpen(true);
    } else {
      setIsCommandOpen(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (data?.data) {
      setDeposits(data.data);
    }
  }, [data]);

  const handleSelectDeposit = (deposit: Stock) => {
    onSelectDeposit(deposit.id.toString());
    setSelectedDeposit(deposit); // 💡 Guardamos el depósito seleccionado
    setSearchQuery("");
    setIsCommandOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <BarChart2 className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <Label htmlFor="deposit-search" className="text-sm font-medium">
            Buscar Depósito
          </Label>
          <div className="relative mt-1">
            <Input
              id="deposit-search"
              placeholder="Buscar por nombre de depósito..."
              className="pl-3 pr-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {isCommandOpen && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1">
                <Command className="rounded-lg border shadow-md">
                  <CommandList>
                    <CommandEmpty>
                      {loading ? "Cargando..." : "No se encontraron depósitos."}
                    </CommandEmpty>
                    <CommandGroup heading="Depósitos">
                      {deposits.map((deposit) => (
                        <CommandItem
                          key={deposit.id}
                          onSelect={() => handleSelectDeposit(deposit)}
                          className="cursor-pointer"
                        >
                          <div>
                            <p>{deposit.name}</p>
                            <p className="text-xs text-gray-500">{deposit.address}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Mostrar depósito seleccionado */}
      {selectedDeposit && (
        <div className="rounded-md border p-3 bg-muted">
          <p className="font-medium">{selectedDeposit.name}</p>
          <p className="text-sm text-muted-foreground">{selectedDeposit.address}</p>
        </div>
      )}
    </div>
  );
}
