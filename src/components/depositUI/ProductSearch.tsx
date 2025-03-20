"use client";

import { useState } from "react";

interface Props {
  onSearch?: (query: string) => void;
}

const ProductSearch: React.FC<Props> = ({ onSearch = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Buscar
      </button>
    </form>
  );
};

export default ProductSearch;
