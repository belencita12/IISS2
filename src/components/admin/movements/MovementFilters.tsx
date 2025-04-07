"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GetMovementQueryParams } from "@/lib/movements/IMovements";
import SearchBar from "@/components/global/SearchBar";
import { useEffect, useState } from "react";
import { getStocks } from "@/lib/stock/getStock";
import { StockData } from "@/lib/stock/IStock";

interface Props {
  token: string;
  filters: GetMovementQueryParams & { managerRuc?: string };
  setFilters: (val: GetMovementQueryParams & { managerRuc?: string }) => void;
  onSearch: () => void;
}

export default function MovementFilters({ token, filters, setFilters }: Props) {
  const handleChange = <K extends keyof Props["filters"]>(
    key: K,
    value: Props["filters"][K]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const [stocks, setStocks] = useState<StockData[]>([]);

  useEffect(() => {
    getStocks({ page: 1 }, token)
      .then((res) => setStocks(res.data))
      .catch((err) => console.error("Error al obtener depósitos", err));
  }, [token]);


  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full">
          <SearchBar
            placeholder="Ingrese el RUC del encargado"
            defaultQuery={filters.managerRuc ?? ""}
            onSearch={(value) => handleChange("managerRuc", value)}
            debounceDelay={300}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Origen</Label>
          <Select
            value={
              filters.originStockId !== undefined
                ? filters.originStockId.toString()
                : "ALL"
            }
            onValueChange={(value) =>
              handleChange(
                "originStockId",
                value === "ALL" ? undefined : Number(value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione Origen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {stocks
                .filter((s) => s.id !== undefined)
                .map((s) => (
                  <SelectItem key={s.id} value={s.id!.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Destino</Label>
          <Select
            value={
              filters.destinationStockId !== undefined
                ? filters.destinationStockId.toString()
                : "ALL"
            }
            onValueChange={(value) =>
              handleChange(
                "destinationStockId",
                value === "ALL" ? undefined : Number(value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione Destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {stocks
                .filter((s) => s.id !== undefined)
                .map((s) => (
                  <SelectItem key={s.id} value={s.id!.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tipo</Label>
          <Select
            value={filters.type ?? "ALL"}
            onValueChange={(value) =>
              handleChange("type", value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="INBOUND">Entrante</SelectItem>
              <SelectItem value="OUTBOUND">Saliente</SelectItem>
              <SelectItem value="TRANSFER">Transferencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
