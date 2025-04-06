"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetPurchaseQueryParams } from "@/lib/purchase/IPurchase";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

interface Props {
  filters: GetPurchaseQueryParams;
  setFilters: (val: GetPurchaseQueryParams) => void;
}

export default function PurchaseNumericFilter({ filters, setFilters }: Props) {
  const [min, setMin] = useState(filters.totalMin?.toString() ?? "");
  const [max, setMax] = useState(filters.totalMax?.toString() ?? "");

  const debouncedMin = useDebounce(min, 500);
  const debouncedMax = useDebounce(max, 500);

  useEffect(() => {
    const totalMin = debouncedMin !== "" ? Number(debouncedMin) : undefined;
    const totalMax = debouncedMax !== "" ? Number(debouncedMax) : undefined;


    if (
      filters.totalMin !== totalMin ||
      filters.totalMax !== totalMax
    ) {
      setFilters({
        ...filters,
        totalMin,
        totalMax,
      });
    }
  }, [debouncedMin, debouncedMax]); 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <Label htmlFor="totalMin">Total mínimo</Label>
        <Input
          id="totalMin"
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="totalMax">Total máximo</Label>
        <Input
          id="totalMax"
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>
    </div>
  );
}
