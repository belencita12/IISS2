"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchBar from "@/components/global/SearchBar";
import { StockData } from "@/lib/stock/IStock";
import { fetchEmployees } from "@/lib/employee/getEmployees";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { toast } from "@/lib/toast";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { z } from "zod";

const movementFormSchema = z.object({
  managerId: z.number().min(1),
  description: z.string().min(1),
  type: z.enum(["INBOUND", "OUTBOUND", "TRANSFER"]),
  originStockId: z.number().min(1),
  destinationStockId: z.number().min(1),
  dateMovement: z.string().min(1),
});

type MovementFormValues = z.infer<typeof movementFormSchema>;

interface MovementDataProps {
  token: string;
  stocks: StockData[];
  register: UseFormRegister<MovementFormValues>;
  errors: FieldErrors<MovementFormValues>;
  setValue: UseFormSetValue<MovementFormValues>;
}

export default function MovementData({
  token,
  stocks,
  register,
  errors,
  setValue,
}: MovementDataProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleSearch = async (query: string) => {
    try {
      const result = await fetchEmployees(1, query, token);
      const data = result.data as EmployeeData[];
      const matches = data.filter((emp) =>
        emp.fullName.toLowerCase().includes(query.trim().toLowerCase())
      );

      if (matches.length === 0) {
        toast("info", "No se encontraron empleados");
        return;
      }

      setEmployees(matches);
      setIsSearching(true);
    } catch {
      toast("error", "Error al buscar empleados");
    }
  };

  const handleSelect = (id: string) => {
    const match = employees.find((e) => e.id !== undefined && e.id.toString() === id);
    if (match && match.id !== undefined) {
      setSelectedId(id);
      setValue("managerId", match.id);
      toast("success", `Encargado seleccionado: ${match.fullName}`);
    }
  };

  const handleCancel = () => {
    setIsSearching(false);
    setEmployees([]);
    setSelectedId(undefined);
    setValue("managerId", 0); // opcional
  };

  return (
    <>
        <div className="w-full">
            <Label>Encargado</Label>
            {!isSearching ? (
                <div className="flex gap-2">
                    <SearchBar
                        placeholder="Buscar encargado..."
                        manualSearch
                        onSearch={handleSearch}
                    />
                </div>
            ) : (
                <div className="flex gap-2">
                    <Select onValueChange={handleSelect} value={selectedId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar encargado..." />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.filter((emp) => emp.id !== undefined)
                            .map((emp) => (
                            <SelectItem key={emp.id} value={emp.id!.toString()}>
                                {emp.fullName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <Button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm text-red-600 hover:underline"
                    >
                    Cancelar
                    </Button>
                </div>
            )}
        </div>

      <div className="flex gap-4 w-full">
        <div className="flex-1">
          <Label>Tipo de Movimiento</Label>
          <select
            {...register("type")}
            className="w-full border rounded p-2"
          >
            <option value="TRANSFER">Transferencia</option>
            <option value="INBOUND">Entrada</option>
            <option value="OUTBOUND">Salida</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        <div className="flex-1">
          <Label>Stock Origen</Label>
          <select
            {...register("originStockId", { valueAsNumber: true })}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccione depósito</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.name}
              </option>
            ))}
          </select>
          {errors.originStockId && (
            <p className="text-red-500 text-sm">
              {errors.originStockId.message}
            </p>
          )}
        </div>

        <div className="flex-1">
          <Label>Stock Destino</Label>
          <select
            {...register("destinationStockId", { valueAsNumber: true })}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccione depósito</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.name}
              </option>
            ))}
          </select>
          {errors.destinationStockId && (
            <p className="text-red-500 text-sm">
              {errors.destinationStockId.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full">
        <Label>Descripción</Label>
        <textarea
          {...register("description")}
          className="w-full border rounded p-2"
          placeholder="Ingrese la descripción del movimiento"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="w-full">
        <Label>Fecha del movimiento</Label>
        <Input type="date" {...register("dateMovement")} />
        {errors.dateMovement && (
          <p className="text-red-500">{errors.dateMovement.message}</p>
        )}
      </div>
    </>
  );
}
