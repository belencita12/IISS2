"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/product/useDebounce";
import GenericPagination from "@/components/global/GenericPagination";
import type { Product } from "@/lib/products/IProducts";
import { getProducts } from "@/lib/products/getProducts";
import { Card } from "@/components/product/ProductCardCliente";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import SearchBar from "../global/SearchBar";
import { CategoryFilter } from "../admin/product/filter/CategoryFilter";
import { NumericFilter } from "../admin/product/filter/NumericFilter";
import { TagFilter } from "../admin/product/filter/TagFilter";
import { ProductCatalogSkeleton } from "./ProductCatalogEsqueleton";
import { SearchX, Filter, RefreshCw, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

const ProductCatalog = ({ token }: { token?: string }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);

    const [inputValues, setInputValues] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        name: "",
    });

    const [filters, setFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        name: "",
    });

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const debouncedMinPrice = useDebounce(inputValues.minPrice, 500);
    const debouncedMaxPrice = useDebounce(inputValues.maxPrice, 500);
    const debouncedName = useDebounce(inputValues.name, 500);

    useEffect(() => {
        const minPrice = debouncedMinPrice !== "0" ? debouncedMinPrice : "";
        const maxPrice = debouncedMaxPrice !== "0" ? debouncedMaxPrice : "";

        if (debouncedMinPrice === "0") {
            toast(
                "warning",
                "El precio mínimo no puede ser 0. Por favor ingrese un valor mayor."
            );
            return;
        }

        if (debouncedMaxPrice === "0") {
            toast(
                "warning",
                "El precio máximo no puede ser 0. Por favor ingrese un valor mayor."
            );
            return;
        }

        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
            toast(
                "warning",
                "El precio máximo debe ser mayor o igual al precio mínimo."
            );
            return;
        }

        setFilters((prev) => ({
            ...prev,
            minPrice,
            maxPrice,
            name: debouncedName,
        }));
        setCurrentPage(1);
    }, [debouncedMinPrice, debouncedMaxPrice, debouncedName]);

    const fetchProducts = useCallback(async () => {
        setIsFiltering(true);
        setError(null);

        const params = {
            page: currentPage,
            size: 12,
            category: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            tags: selectedTags.join(","),
            name: filters.name,
        };

        try {
            const response = await getProducts(params, token);
            setProducts(response.data || []);
            setTotalPages(response.totalPages || 1);
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al obtener los productos.");
            }
            toast(
                "error",
                "Error al cargar los productos. Por favor intente nuevamente."
            );
        } finally {
            setLoading(false);
            setIsFiltering(false);
        }
    }, [token, currentPage, filters, selectedTags]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const preventInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "-" || e.key === "e") e.preventDefault();
    };

    const onTagsChange = (tags: string[]) => {
        setSelectedTags(tags);
        setCurrentPage(1);
    };

    const handleSearch = (query: string) => {
        setInputValues((prev) => ({
            ...prev,
            name: query,
        }));
    };

    const handleCategoryChange = (category: string) => {
        setInputValues((prev) => ({ ...prev, category }));
        setFilters((prev) => ({ ...prev, category }));
        setCurrentPage(1);
    };

    const handleClearCategory = () => {
        setInputValues((prev) => ({ ...prev, category: "" }));
        setFilters((prev) => ({ ...prev, category: "" }));
        setCurrentPage(1);
    };

    const handleMinPriceChange = (minPrice: string) => {
        setInputValues((prev) => ({ ...prev, minPrice }));
    };

    const handleMaxPriceChange = (maxPrice: string) => {
        setInputValues((prev) => ({ ...prev, maxPrice }));
    };

    const handleClearMinPrice = () => {
        setInputValues((prev) => ({ ...prev, minPrice: "" }));
        setFilters((prev) => ({ ...prev, minPrice: "" }));
        setCurrentPage(1);
    };

    const handleClearMaxPrice = () => {
        setInputValues((prev) => ({ ...prev, maxPrice: "" }));
        setFilters((prev) => ({ ...prev, maxPrice: "" }));
        setCurrentPage(1);
    };

    const handleClearAllFilters = () => {
        setInputValues({ category: "", minPrice: "", maxPrice: "", name: "" });
        setFilters({ category: "", minPrice: "", maxPrice: "", name: "" });
        setSelectedTags([]);
        setCurrentPage(1);
        toast("info", "Todos los filtros han sido eliminados");
    };

    const handleRemoveTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
        setCurrentPage(1);
    };

    const hasActiveFilters =
        filters.category !== "" ||
        filters.minPrice !== "" ||
        filters.maxPrice !== "" ||
        filters.name !== "" ||
        selectedTags.length > 0;

    if (loading && products.length === 0) {
        return <ProductCatalogSkeleton />;
    }

    if (error && !loading && products.length === 0) {
        return (
            <div className="p-4 md:p-6 min-h-screen">
                <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setLoading(true);
                            fetchProducts();
                            toast(
                                "info",
                                "Intentando cargar productos nuevamente..."
                            );
                        }}
                        className="mx-auto"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4 relative">
            {isFiltering && (
                <>
                    <div className="fixed inset-0 z-40 bg-white bg-opacity-10 pointer-events-auto" />
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                        <div className="bg-white/90 rounded-full shadow-md py-2 px-4 flex items-center gap-2 border border-gray-100">
                            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                            <p className="text-sm text-gray-600">
                                Actualizando...
                            </p>
                        </div>
                    </div>
                </>
            )}

            <div className="max-w-7xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold mb-4">Tienda NicoPets</h1>
                <div className="w-full mx-auto bg-gray-50 py-2">
                    <SearchBar onSearch={handleSearch} />

                    {selectedTags.length > 0 && (
                        <div className="mt-4 mb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Tag className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    Etiquetas seleccionadas:
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors hover:bg-blue-100"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-blue-200 text-blue-700 hover:bg-blue-300 transition-colors"
                                            disabled={isFiltering}
                                            aria-label={`Eliminar etiqueta ${tag}`}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {selectedTags.length > 1 && (
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className="text-xs text-gray-500 hover:text-gray-700 hover:underline px-2 py-1"
                                        disabled={isFiltering}
                                    >
                                        Limpiar todas
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-[30%] bg-white rounded-lg border shadow-sm p-5 space-y-5 h-fit max-h-screen overflow-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold mb-[10px]">
                                Filtros
                            </h2>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAllFilters}
                                    className="text-xs h-8 px-2 text-gray-500 hover:text-gray-700"
                                    disabled={isFiltering}
                                >
                                    Limpiar todo
                                </Button>
                            )}
                        </div>
                        <label>Categoría</label>
                        <CategoryFilter
                            category={inputValues.category}
                            onCategoryChange={handleCategoryChange}
                            onClearCategory={handleClearCategory}
                        />
                        <br />
                        <label>Precio</label>
                        <NumericFilter
                            label=""
                            minValue={inputValues.minPrice}
                            maxValue={inputValues.maxPrice}
                            onMinChange={handleMinPriceChange}
                            onMaxChange={handleMaxPriceChange}
                            onClearMin={handleClearMinPrice}
                            onClearMax={handleClearMaxPrice}
                            preventInvalidKeys={preventInvalidKeys}
                        />

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tags
                            </label>
                            <TagFilter
                                title="Etiqueta"
                                selectedTags={selectedTags}
                                onChange={onTagsChange}
                                token={token || ""}
                            />
                        </div>
                    </aside>

                    <main className="flex-1 min-h-[800px]">
                        {products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-3 gap-4 lg:w-[970px]">
                                    {products.slice(0, 12).map((product) => (
                                        <Card
                                            key={product.id}
                                            title={product.name}
                                            price={`${product.price.toLocaleString()} Gs.`}
                                            image={
                                                product.image?.originalUrl ??
                                                NotImageNicoPets.src
                                            }
                                            ctaText="Ver detalles"
                                            ctaLink={`/shop/product/${product.id}`}
                                            tags={product.tags}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center lg:w-[970px] bg-white border rounded-lg shadow-sm p-10 text-center min-h-[400px]">
                                <SearchX className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-medium text-gray-700 mb-2">
                                    No se encontraron productos
                                </h3>
                                <p className="text-gray-500 max-w-md mb-6">
                                    No hay productos que coincidan con los
                                    filtros seleccionados. Intenta modificar tus
                                    criterios de búsqueda.
                                </p>
                                {hasActiveFilters && (
                                    <Button
                                        onClick={handleClearAllFilters}
                                        className="flex items-center"
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        Limpiar todos los filtros
                                    </Button>
                                )}
                            </div>
                        )}

                        {products.length > 0 && (
                            <div className="mt-8">
                                <GenericPagination
                                    handlePreviousPage={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    handlePageChange={handlePageChange}
                                    handleNextPage={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductCatalog;
