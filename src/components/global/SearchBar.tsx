"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  defaultQuery?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Buscar...",
  debounceDelay = 500,
  defaultQuery = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const debouncedQuery = useDebounce(query, debounceDelay);

  useEffect(() => {
    onSearch(debouncedQuery.trim());
  }, [debouncedQuery, onSearch]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="flex items-center gap-2 mb-4 w-full">
      <div className="relative w-full">
        <Input
          placeholder={placeholder}
          className="pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={clearSearch}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
