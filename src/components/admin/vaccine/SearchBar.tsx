"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "@/lib/toast";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            toast("info", "Debes ingresar algo para buscar!");
            onSearch(""); // Esto debería restaurar los datos en el componente padre
            return;
        }
        onSearch(trimmedQuery);
    };

    const clearSearch = () => {
        setQuery("");
        onSearch(""); // Llamar a onSearch con cadena vacía para restaurar datos
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="relative w-full">
                <Input
                    placeholder="Buscar por nombre o productor..."
                    className="pr-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
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
            <Button onClick={handleSearch}>Buscar</Button>
        </div>
    );
}
