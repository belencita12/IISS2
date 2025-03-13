"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/toast";

interface SearchBarProps {
    onSearch: (query: string, filterType: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState("email");

    const handleSearch = () => {
        if (!query.trim()) {
            toast("info", "Debes ingresar algo para buscar!");
            return;
        }
        onSearch(query, filterType);
    };

    const handleClear = () => {
        setQuery("");
    };

    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="relative w-full">
                <Input
                    placeholder="Buscar..."
                    className="pr-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={handleClear}
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="p-2">
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="border rounded-md p-2">
                        <SelectValue placeholder="Seleccionar filtro" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="fullName">Nombre</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
        </div>
    );
};

