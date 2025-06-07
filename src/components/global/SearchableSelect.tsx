import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Option {
  id: number;
  label: string;
}

interface Props {
  label: string;
  placeholder?: string;
  value?: string;
  options: Option[];
  isLoading?: boolean;
  disabled?: boolean;
  onChangeSearch: (term: string) => void;
  noOptionsMessage?: string;
  onSelect: (option: Option) => void;
}

export default function SearchableSelect({
  label,
  placeholder,
  value = "",
  options,
  isLoading = false,
  disabled = false,
  onChangeSearch,
  onSelect,
  noOptionsMessage, // <-- Agregado aquí
}: Props) {
  const [isListVisible, setIsListVisible] = useState(false);

  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <div className="flex gap-2 align-middle items-center w-full">
        <div className="relative flex-1">
          <Input
            type="text"
            className="pr-10"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChangeSearch(e.target.value)}
            onFocus={() => setIsListVisible(true)}
            onBlur={() => setTimeout(() => setIsListVisible(false), 200)}
            disabled={disabled}
          />

          {isListVisible && !disabled && (
            <div className="absolute z-50 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
              {options.length === 0 && !isLoading ? (
                <div className="p-2 text-gray-500">
                  {noOptionsMessage || "Escriba para buscar resultados"}
                </div>
              ) : (
                options.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => onSelect(opt)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {opt.label}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {isLoading && (
          <Loader2 className="right-2 top-1/2 h-4 w-4 text-gray-500 animate-spin" />
        )}
      </div>
    </div>
  );
}
