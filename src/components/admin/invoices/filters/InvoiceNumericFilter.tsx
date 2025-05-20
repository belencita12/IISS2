"use client";

import NumericInput from "@/components/global/NumericInput"; 
import { Label } from "@/components/ui/label";
import { GetInvoiceQueryParams } from "@/lib/invoices/IInvoice";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  filters: GetInvoiceQueryParams;
  setFilters: (val: GetInvoiceQueryParams) => void;
}

export default function InvoiceNumericFilter({ filters, setFilters }: Props) {
  const f = useTranslations("Filters");
  const ph = useTranslations("Placeholder");

  const [min, setMin] = useState(filters.fromTotal?.toString() ?? "");
  const [max, setMax] = useState(filters.toTotal?.toString() ?? "");

  const debouncedMin = useDebounce(min, 500);
  const debouncedMax = useDebounce(max, 500);

  const isMaxLessThanMin =
    max !== "" && min !== "" && Number(max) < Number(min);

  useEffect(() => {
    const totalMin = debouncedMin !== "" ? Number(debouncedMin) : undefined;
    const totalMax = debouncedMax !== "" ? Number(debouncedMax) : undefined;

    // Solo actualiza si el máximo no es menor al mínimo
    if (!isMaxLessThanMin && (filters.fromTotal !== totalMin || filters.toTotal !== totalMax)) {
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
        <Label htmlFor="totalMin">{f("minTotal")}</Label>
        <NumericInput
          id="totalMin"
          type="formattedNumber"
          value={min}
          placeholder={ph("minAmount")}
          onChange={(e) => setMin(e.target.value)} 
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalMax">{f("maxTotal")}</Label>
        <NumericInput
          id="totalMax"
          type="formattedNumber"
          value={max}
          placeholder={ph("maxAmount")}
          onChange={(e) => setMax(e.target.value)} 
          className="w-full border px-3 py-2 rounded"
        />
        {isMaxLessThanMin && (
          <p className="text-sm text-red-500">{f("isMaxLessThanMin")}</p>
        )}
      </div>
    </div>
  );
}
