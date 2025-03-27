import React from 'react';
import { X } from 'lucide-react';

interface CategoryFilterProps {
  category: string;
  onCategoryChange: (category: string) => void;
  onClearCategory: () => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  category,
  onCategoryChange,
  onClearCategory,
}) => {
  return (
    <div className="relative">
      <select
        title="type"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value === "none" ? "" : e.target.value)}
        className="border p-2 rounded w-40"
      >
        <option value="" disabled hidden>
          Categoria
        </option>
        <option value="none">Ninguno</option>
        <option value="PRODUCT">Producto</option>
        <option value="VACCINE">Vacuna</option>
      </select>
      {category !== "" && (
        <button
          onClick={onClearCategory}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};