import React from "react";
import { X } from "lucide-react";
import NumericInput from "@/components/global/NumericInput"; // Ajustá la ruta según dónde esté tu componente

interface NumericFilterProps {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  onClearMin: () => void;
  onClearMax: () => void;
  preventInvalidKeys?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}


export const NumericFilter: React.FC<NumericFilterProps> = ({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  onClearMin,
  onClearMax,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0">
      <span className="text-sm">{label}</span>

      <div className="relative w-28">
        <NumericInput
          id="min"
          type="formattedNumber"
          placeholder="Desde"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          className="p-1"
        />
        {minValue && (
          <button
            onClick={onClearMin}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <span className="text-sm">-</span>

      <div className="relative w-28">
        <NumericInput
          id="max"
          type="formattedNumber"
          placeholder="Hasta"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          className="p-1"
        />
        {maxValue && (
          <button
            onClick={onClearMax}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
