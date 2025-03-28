"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "@/lib/toast";
import useDebounce from "@/lib/admin/products/useDebounceHook";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    debounceDelay?: number;
    defaultQuery?: string;
    manualSearch?: boolean;
}

/**
 * 🔍 SearchBar reutilizable para búsquedas por texto en tablas o listados.
 * 
 * Props:
 * - onSearch: función que recibe el texto a buscar (se llama automáticamente o manualmente).
 * - placeholder?: texto del input (por defecto: "Buscar...").
 * - debounceDelay?: tiempo de espera para ejecutar la búsqueda automática (default: 500ms).
 * - defaultQuery?: valor inicial del input.
 * - manualSearch?: si true, la búsqueda solo se ejecuta al presionar Enter o el botón "Buscar".
 */


export default function SearchBar({
    onSearch,
    placeholder = "Buscar...",
    debounceDelay = 500,
    defaultQuery = "",
    manualSearch = false,
}: SearchBarProps) {
    const [query, setQuery] = useState(defaultQuery);
    const debouncedQuery = useDebounce(query, debounceDelay);

    // Callback para controlar la búsqueda (puede ser manual o automática)
    const triggerSearch = useCallback(
        (val: string) => {
            const trimmed = val.trim();
            onSearch(trimmed); 
        },
        [onSearch]
    );


    useEffect(() => {
        if (!manualSearch) {
            triggerSearch(debouncedQuery);
        }
    }, [debouncedQuery, manualSearch, triggerSearch]);

    useEffect(() => {
        setQuery(defaultQuery || "");
      }, [defaultQuery]);      

    const handleManualSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) {
            toast("info", "Debes ingresar algo para buscar.");
            onSearch("");
            return;
        }
        onSearch(trimmed);
    };

    const clearSearch = () => {
        setQuery("");
        onSearch("");
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
                            handleManualSearch();
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
            {manualSearch && (
                <Button onClick={handleManualSearch}>Buscar</Button>
            )}
        </div>
    );
}
