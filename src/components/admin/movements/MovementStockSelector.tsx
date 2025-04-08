import { Controller } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { StockData } from "@/lib/stock/IStock";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Movement } from "@/lib/movements/IMovements";
import { useEffect } from "react";

interface Props {
  type?: "INBOUND" | "OUTBOUND" | "TRANSFER";
  stocks: StockData[];
  control: Control<Movement>;
  setValue: UseFormSetValue<Movement>;
  errors: FieldErrors<Movement>;
}

export default function MovementStockSelector({ type, stocks, control, setValue, errors }: Props) {
  useEffect(() => {
    if (type === "INBOUND") {
      setValue("originStockId", undefined);
    } else if (type === "OUTBOUND") {
      setValue("destinationStockId", undefined);
    }
  }, [type, setValue]);

  return (
    <>
      {/* Depósito Origen */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Depósito Origen</label>
        <Controller
          name="originStockId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(v) => field.onChange(Number(v))}
              value={field.value?.toString()}
              disabled={type === "INBOUND"} // Bloqueado si es entrada
            >
              <SelectTrigger className={errors.originStockId ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar origen" />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((stock) => (
                  <SelectItem key={stock.id} value={String(stock.id)}>
                    {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.originStockId && (
          <p className="text-red-500 text-sm">{errors.originStockId.message}</p>
        )}
      </div>

      {/* Depósito Destino */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Depósito Destino</label>
        <Controller
          name="destinationStockId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(v) => field.onChange(Number(v))}
              value={field.value?.toString()}
              disabled={type === "OUTBOUND"} // Bloqueado si es salida
            >
              <SelectTrigger className={errors.destinationStockId ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((stock) => (
                  <SelectItem key={stock.id} value={String(stock.id)}>
                    {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.destinationStockId && (
          <p className="text-red-500 text-sm">{errors.destinationStockId.message}</p>
        )}
      </div>
    </>
  );
}
