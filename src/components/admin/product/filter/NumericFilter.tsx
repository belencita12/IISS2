"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import NumericInput from "@/components/global/NumericInput";

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

  const isMaxLessThanMin =
    localMin !== "" &&
    localMax !== "" &&
    parseFloat(localMax) < parseFloat(localMin);

  // Actualiza estado local y propaga cambios al padre
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4 sm:mt-0">
      <span className="text-sm shrink-0 mt-2 sm:mt-0">{label}</span>

      <div className="relative w-28">
        <NumericInput
          id="min"
          type="formattedNumber"
          placeholder="Desde"
          value={localMin}
          onChange={(e) => handleMinChange(e.target.value)}
          onKeyDown={preventInvalidKeys}
          className="p-1"
        />
        {localMin && (
          <button
            onClick={() => {
              setLocalMin("");
              onClearMin();
              onMinChange("");
            }}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <span className="text-sm shrink-0 mt-2 sm:mt-0">-</span>

      <div className="relative w-28 overflow-visible">
        <NumericInput
          id="max"
          type="formattedNumber"
          placeholder="Hasta"
          value={localMax}
          onChange={(e) => handleMaxChange(e.target.value)}
          onKeyDown={preventInvalidKeys}
          className="p-1"
        />
        {localMax && (
          <button
            onClick={() => {
              setLocalMax("");
              onClearMax();
              onMaxChange("");
            }}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        {isMaxLessThanMin && (
          <p className="absolute left-0 top-full mt-1 text-xs text-red-500">
            No puede ser menor al mínimo
          </p>
        )}
      </div>
    </div>
  );
};
