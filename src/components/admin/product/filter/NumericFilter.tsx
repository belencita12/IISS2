"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import NumericInput from "@/components/global/NumericInput";
import { useTranslations } from "next-intl";

interface NumericFilterProps {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  onClearMin: () => void;
  onClearMax: () => void;
  preventInvalidKeys: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const NumericFilter: React.FC<NumericFilterProps> = ({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  onClearMin,
  onClearMax,
  preventInvalidKeys,
}) => {
  const [localMin, setLocalMin] = useState<string>(minValue);
  const [localMax, setLocalMax] = useState<string>(maxValue);

  const f = useTranslations("Filters");
  const e = useTranslations("Error");

  const isMaxLessThanMin =
    localMin !== "" &&
    localMax !== "" &&
    parseFloat(localMax) < parseFloat(localMin);

  const handleMinChange = (value: string) => {
    setLocalMin(value);
    onMinChange(value);
  };

  const handleMaxChange = (value: string) => {
    setLocalMax(value);
    onMaxChange(value);
  };

  useEffect(() => setLocalMin(minValue), [minValue]);
  useEffect(() => setLocalMax(maxValue), [maxValue]);

  return (
    <div className="flex flex-col w-full sm:mt-0">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex flex-row gap-2 items-center">
        <div className="relative w-full">
          <NumericInput
            id="min"
            type="formattedNumber"
            placeholder={f("from")}
            value={localMin}
            onChange={(e) => handleMinChange(e.target.value)}
            onKeyDown={preventInvalidKeys}
            className="p-1 w-full"
          />
          {localMin && (
            <button
              onClick={() => {
                setLocalMin("");
                onClearMin();
                onMinChange("");
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="relative w-full">
          <NumericInput
            id="max"
            type="formattedNumber"
            placeholder={f("to")}
            value={localMax}
            onChange={(e) => handleMaxChange(e.target.value)}
            onKeyDown={preventInvalidKeys}
            className="p-1 w-full"
          />
          {localMax && (
            <button
              onClick={() => {
                setLocalMax("");
                onClearMax();
                onMaxChange("");
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          {isMaxLessThanMin && (
            <p className="absolute left-0 top-full mt-1 text-xs text-red-500">
              {e("numericMin")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
