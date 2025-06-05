"use client";

import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

interface Props {
  to: string | undefined;
  from: string | undefined;
  setDateTo: (to: string | undefined) => void;
  setDateFrom: (from: string | undefined) => void;
}

export default function DateFilter({
  to,
  from,
  setDateFrom,
  setDateTo,
}: Props) {

  const t = useTranslations();
  const [startDate, setStartDate] = useState(from ?? "");
  const [endDate, setEndDate] = useState(to ?? "");
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  useEffect(() => {
    if (from !== debouncedStartDate) setDateFrom(debouncedStartDate || undefined);
    // Solo actualiza si cambia el valor debounced
    // eslint-disable-next-line
  }, [debouncedStartDate]);
  useEffect(() => {
    if (to !== debouncedEndDate) setDateTo(debouncedEndDate || undefined);
    // eslint-disable-next-line
  }, [debouncedEndDate]);

  useEffect(()=>{
    setStartDate(from?? "")
    setEndDate(to?? "")
  },[to, from])

  const isEndDateBeforeStart = from && to && to < from;
  const toDateError = isEndDateBeforeStart
    ? t("error.errorDate")
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="from">{t("filters.date.from")}</Label>
        <input
          id="from"
          type="date"
          className={clsx(
            "w-full border px-3 py-2 rounded",
            toDateError && "border-red-500"
          )}
          value={startDate}
          onChange={(e) => {
            const value = e.target.value;
            setStartDate(value);
          }}
          min="1900-01-01"
          max={new Date().toISOString().split("T")[0]}
          onBlur={(e) => {
            const min = "1900-01-01";
            const max = new Date().toISOString().split("T")[0];
            let value = e.target.value;
            if (value && (value < min || value > max)) {
              value = value < min ? min : max;
              setStartDate(value);
            }
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="to">{t("filters.date.to")}</Label>
        <input
          id="to"
          type="date"
          className={clsx(
            "w-full border px-3 py-2 rounded",
            toDateError && "border-red-500"
          )}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min="1900-01-01"
          max={new Date().toISOString().split("T")[0]}
          onBlur={(e) => {
            const min = "1900-01-01";
            const max = new Date().toISOString().split("T")[0];
            let value = e.target.value;
            if (value && (value < min || value > max)) {
              value = value < min ? min : max;
              setEndDate(value);
            }
          }}
        />
        {toDateError && (
          <p className="text-red-600 text-sm mt-1">{toDateError}</p>
        )}
      </div>
    </div>
  );
}
