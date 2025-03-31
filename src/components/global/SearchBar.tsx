"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import useDebounce from "@/lib/admin/products/useDebounceHook";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  defaultQuery?: string;
  manualSearch?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = "Buscar...",
  debounceDelay = 500,
  defaultQuery = "",
  manualSearch = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const debouncedQuery = useDebounce(query, debounceDelay);
  const [lastQuery, setLastQuery] = useState("");

  useEffect(() => {
    if (!manualSearch && debouncedQuery !== lastQuery) {
      onSearch(debouncedQuery);
      setLastQuery(debouncedQuery);
    }
  }, [debouncedQuery, lastQuery, onSearch, manualSearch]);

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
          onKeyDown={(e) => {
            if (e.key === "Enter" && manualSearch) {
              onSearch(query);
            }
          }}
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
      {manualSearch && <Button onClick={() => onSearch(query)}>Buscar</Button>}
    </div>
  );
}
