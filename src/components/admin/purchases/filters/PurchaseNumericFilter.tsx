"use client";

import NumericInput from "@/components/global/NumericInput"; 
import { Label } from "@/components/ui/label";
import { GetPurchaseQueryParams } from "@/lib/purchases/IPurchase";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  filters: GetPurchaseQueryParams;
  setFilters: (val: GetPurchaseQueryParams) => void;
}

export default function PurchaseNumericFilter({ filters, setFilters }: Props) {
  const [min, setMin] = useState(filters.totalMin?.toString() ?? "");
  const [max, setMax] = useState(filters.totalMax?.toString() ?? "");

  const debouncedMin = useDebounce(min, 500);
  const debouncedMax = useDebounce(max, 500);

  const f = useTranslations("Filters");
  const ph = useTranslations("Placeholder");

  useEffect(() => {
    const totalMin = debouncedMin !== "" ? Number(debouncedMin) : undefined;
    const totalMax = debouncedMax !== "" ? Number(debouncedMax) : undefined;

    if (filters.totalMin !== totalMin || filters.totalMax !== totalMax) {
      setFilters({
        ...filters,
        totalMin,
        totalMax,
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
      </div>
    </div>
  );
}
