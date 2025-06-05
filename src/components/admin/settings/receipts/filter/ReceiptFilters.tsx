"use client";

import NumericInput from "@/components/global/NumericInput";
import { Label } from "@/components/ui/label";
import { ReceiptFiltersParams } from "@/lib/receipts/IReceipt";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import SearchBar from "@/components/global/SearchBar";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props {
  filters: ReceiptFiltersParams;
  setFilters: (val: ReceiptFiltersParams) => void;
}

export default function ReceiptFilters({ filters, setFilters }: Props) {

  const t = useTranslations();
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
      newErrors.receipt = t("filters.receipts.receiptNumber");
      hasErrors = true;
    }

    if (minNumber !== undefined && minNumber <= 0) {
      newErrors.min = t("filters.receipts.minAmount");
      hasErrors = true;
    }

    if (maxNumber !== undefined && maxNumber <= 0) {
      newErrors.max = t("filters.receipts.maxAmount");
      hasErrors = true;
    }

    if (isMaxLessThanMin) {
      newErrors.max = t("filters.priceRange.errorNumericMin");
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
            placeholder={t("search.searchByNameOrRuc")}
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
            placeholder={t("search.searchByReceiptNumber")}
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
          <Label htmlFor="fromTotal">{t("filters.priceRange.minAmount")}</Label>
          <NumericInput
            id="fromTotal"
            type="formattedNumber"
            value={min}
            placeholder={t("placeholder.minAmount")}
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
          <Label htmlFor="toTotal">{t("filters.priceRange.maxAmount")}</Label>
          <NumericInput
            id="toTotal"
            type="formattedNumber"
            value={max}
            placeholder={t("placeholder.maxAmount")}
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
