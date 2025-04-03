"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GetMovementQueryParams } from "@/lib/movements/IMovements";

interface Props {
  filters: GetMovementQueryParams & { managerRuc?: string }; // agregás managerRuc si es necesario
  setFilters: (val: GetMovementQueryParams & { managerRuc?: string }) => void;
  onSearch: () => void;
}

export default function MovementFilters({
  filters,
  setFilters,
  onSearch,
}: Props) {
  const handleChange = <K extends keyof Props["filters"]>(
    key: K,
    value: Props["filters"][K]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const toStringOrEmpty = (value: number | undefined): string => {
    return value !== undefined ? value.toString() : "";
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/2">
          <Label htmlFor="managerRuc">RUC del Encargado</Label>
          <Input
            id="managerRuc"
            type="text"
            placeholder="Ingrese el RUC"
            value={filters.managerRuc ?? ""}
            onChange={(e) => handleChange("managerRuc", e.target.value)}
          />
        </div>

        <Button
          onClick={onSearch}
          className="bg-black text-white hover:bg-gray-800 mt-2 md:mt-6"
        >
          Buscar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Origen</Label>
          <Select
            value={toStringOrEmpty(filters.originStockId)}
            onValueChange={(value) =>
              handleChange("originStockId", Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione Origen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Depósito Central</SelectItem>
              <SelectItem value="2">Sucursal A</SelectItem>
              {/* Podés hacer dinámico esto */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Destino</Label>
          <Select
            value={toStringOrEmpty(filters.destinationStockId)}
            onValueChange={(value) =>
              handleChange("destinationStockId", Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione Destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Depósito Central</SelectItem>
              <SelectItem value="2">Sucursal A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tipo</Label>
          <Select
            value={filters.type ?? ""}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INBOUND">Transferencia</SelectItem>
              <SelectItem value="EXPIRED">Vencimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
