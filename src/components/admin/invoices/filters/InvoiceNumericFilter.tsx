"use client";

import NumericInput from "@/components/global/NumericInput"; 
import { Label } from "@/components/ui/label";
import { GetInvoiceQueryParams } from "@/lib/invoices/IInvoice";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

interface Props {
  filters: GetInvoiceQueryParams;
  setFilters: (val: GetInvoiceQueryParams) => void;
}

export default function InvoiceNumericFilter({ filters, setFilters }: Props) {
  const [min, setMin] = useState(filters.fromTotal?.toString() ?? "");
  const [max, setMax] = useState(filters.toTotal?.toString() ?? "");

  const debouncedMin = useDebounce(min, 500);
  const debouncedMax = useDebounce(max, 500);

  useEffect(() => {
    // Si el valor es vacío, lo consideramos undefined
    const totalMin = debouncedMin !== "" ? Number(debouncedMin) : undefined;
    const totalMax = debouncedMax !== "" ? Number(debouncedMax) : undefined;

    if (filters.fromTotal !== totalMin || filters.toTotal !== totalMax) {
      setFilters({
        ...filters,
        fromTotal: totalMin,
        toTotal: totalMax,
      });
    }
  }, [debouncedMin, debouncedMax]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="totalMin">Total mínimo</Label>
        <NumericInput
          id="totalMin"
          type="formattedNumber"
          value={min}
          placeholder="Ejemplo: 100.000"
          onChange={(e) => setMin(e.target.value)} // Mantenemos el valor vacío si el campo se borra
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalMax">Total máximo</Label>
        <NumericInput
          id="totalMax"
          type="formattedNumber"
          value={max}
          placeholder="Ejemplo: 1.000.000"
          onChange={(e) => setMax(e.target.value)} // Mantenemos el valor vacío si el campo se borra
          className="w-full border px-3 py-2 rounded"
        />
      </div>
    </div>
  );
}
