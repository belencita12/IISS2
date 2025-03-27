import React from 'react';
import { X } from 'lucide-react';

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
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0">
      <span className="text-sm">{label}</span>
      <div className="relative">
        <input
          type="number"
          min="0"
          step="100"
          placeholder="Desde"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          onKeyDown={preventInvalidKeys}
          className="border p-1 rounded w-28"
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
      <div className="relative">
        <input
          type="number"
          min="0"
          step="100"
          placeholder="Hasta"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          onKeyDown={preventInvalidKeys}
          className="border p-1 rounded w-28"
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