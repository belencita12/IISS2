import { Controller, Control, FieldErrors, UseFormSetValue, useWatch } from "react-hook-form";
import { Movement } from "@/lib/movements/IMovements"; // Asegurate que este tipo tenga originStockId y destinationStockId
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

type Props = {
  control: Control<Movement>;
  errors: FieldErrors<Movement>;
  stocks: { id: number; name: string }[];
  setValue: UseFormSetValue<Movement>;
};

const MovementStockSelector = ({ control, errors, stocks, setValue }: Props) => {
  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    if (type === "INBOUND") {
      setValue("originStockId", undefined);
    } else if (type === "OUTBOUND") {
      setValue("destinationStockId", undefined);
    }
  }, [type, setValue]);

  return (
    <>
      {(type === "OUTBOUND" || type === "TRANSFER") && (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Depósito Origen</label>
          <Controller
            name="originStockId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(v) => field.onChange(Number(v))}
                value={field.value?.toString()}
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
      )}

      {(type === "INBOUND" || type === "TRANSFER") && (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Depósito Destino</label>
          <Controller
            name="destinationStockId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(v) => field.onChange(Number(v))}
                value={field.value?.toString()}
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
      )}
    </>
  );
};

export default MovementStockSelector;
