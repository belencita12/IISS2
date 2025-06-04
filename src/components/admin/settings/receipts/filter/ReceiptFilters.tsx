"use client";

import NumericInput from "@/components/global/NumericInput";
import { Label } from "@/components/ui/label";
import { ReceiptFiltersParams } from "@/lib/receipts/IReceipt";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import SearchBar from "@/components/global/SearchBar";
import clsx from "clsx";

interface Props {
  filters: ReceiptFiltersParams;
  setFilters: (val: ReceiptFiltersParams) => void;
}

export default function ReceiptFilters({ filters, setFilters }: Props) {
  const [min, setMin] = useState(filters.fromTotal?.toString() ?? "");
  const [max, setMax] = useState(filters.toTotal?.toString() ?? "");
  const [receipt, setReceipt] = useState(
    filters.receiptNumber?.toString() ?? ""
  );
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm ?? "");

  const [errors, setErrors] = useState({
    receipt: "",
    min: "",
    max: "",
  });

  const debouncedMin = useDebounce(min, 800);
  const debouncedMax = useDebounce(max, 800);
  const debouncedReceipt = useDebounce(receipt, 800);
  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  const minNumber = debouncedMin !== "" ? Number(debouncedMin) : undefined;
  const maxNumber = debouncedMax !== "" ? Number(debouncedMax) : undefined;
  const receiptNumber =
    debouncedReceipt !== "" ? Number(debouncedReceipt) : undefined;

  const isMaxLessThanMin =
    minNumber !== undefined && maxNumber !== undefined && maxNumber < minNumber;

  useEffect(() => {
    const newErrors = {
      receipt: "",
      min: "",
      max: "",
    };

    let hasErrors = false;

    if (receiptNumber !== undefined && receiptNumber <= 0) {
      newErrors.receipt = "El número de recibo debe ser mayor a 0.";
      hasErrors = true;
    }

    if (minNumber !== undefined && minNumber <= 0) {
      newErrors.min = "El monto mínimo debe ser mayor a 0.";
      hasErrors = true;
    }

    if (maxNumber !== undefined && maxNumber <= 0) {
      newErrors.max = "El monto máximo debe ser mayor a 0.";
      hasErrors = true;
    }

    if (isMaxLessThanMin) {
      newErrors.max = "El monto máximo no puede ser menor al mínimo.";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) return;

    setFilters({
      ...filters,
      fromTotal: minNumber,
      toTotal: maxNumber,
      receiptNumber,
      searchTerm: debouncedSearchTerm.trim() || undefined,
    });
  }, [debouncedMin, debouncedMax, debouncedReceipt, debouncedSearchTerm]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-2">
          <SearchBar
            placeholder="Buscar cliente por nombre o RUC"
            defaultQuery={filters.searchTerm ?? ""}
            onSearch={(value) => {
              // Eliminar las comas
              const filtered = value.replace(/[.,]/g, "");
              setSearchTerm(filtered);
            }}
          />
        </div>

        <div className="space-y-2">
          <NumericInput
            id="receiptNumber"
            type="formattedNumber"
            value={receipt}
            placeholder="Buscar por Nro. de Recibo"
            onChange={(e) => setReceipt(e.target.value)}
            className={clsx(
              "w-full border px-3 py-2 rounded",
              errors.receipt && "border-red-500"
            )}
          />
          {errors.receipt && (
            <p className="text-red-600 text-sm mt-1">{errors.receipt}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fromTotal">Monto mínimo</Label>
          <NumericInput
            id="fromTotal"
            type="formattedNumber"
            value={min}
            placeholder="Ej. 10.000"
            onChange={(e) => setMin(e.target.value)}
            className={clsx(
              "w-full border px-3 py-2 rounded",
              errors.min && "border-red-500"
            )}
          />
          {errors.min && (
            <p className="text-red-600 text-sm mt-1">{errors.min}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="toTotal">Monto máximo</Label>
          <NumericInput
            id="toTotal"
            type="formattedNumber"
            value={max}
            placeholder="Ej. 50.000"
            onChange={(e) => setMax(e.target.value)}
            className={clsx(
              "w-full border px-3 py-2 rounded",
              errors.max && "border-red-500"
            )}
          />
          {errors.max && (
            <p className="text-red-600 text-sm mt-1">{errors.max}</p>
          )}
        </div>
      </div>
    </div>
  );
}
