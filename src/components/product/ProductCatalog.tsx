"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useDebounce } from "@/hooks/product/useDebounce"
import GenericPagination from "@/components/global/GenericPagination"
import type { Product } from "@/lib/products/IProducts"
import { getProducts } from "@/lib/products/getProducts"
import { Card } from "@/components/product/ProductCardCliente"
import NotImageNicoPets from "../../../public/NotImageNicoPets.png"
import SearchBar from "../global/SearchBar"
import { CategoryFilter } from "../admin/product/filter/CategoryFilter"
import { NumericFilter } from "../admin/product/filter/NumericFilter"
import { TagFilter } from "../admin/product/filter/TagFilter"
import { ProductCatalogSkeleton } from "./ProductCatalogEsqueleton"
import { SearchX, Filter, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"

const ProductCatalog = ({ token }: { token: string | null }) => {
    const [products, setProducts] = useState<Product[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFiltering, setIsFiltering] = useState(false)

    const [inputValues, setInputValues] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        name: "",
    })

    const [filters, setFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        name: "",
    })

    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const debouncedMinPrice = useDebounce(inputValues.minPrice, 500)
    const debouncedMaxPrice = useDebounce(inputValues.maxPrice, 500)
    const debouncedName = useDebounce(inputValues.name, 500)

    useEffect(() => {
        const minPrice = debouncedMinPrice !== "0" ? debouncedMinPrice : ""
        const maxPrice = debouncedMaxPrice !== "0" ? debouncedMaxPrice : ""

        if (debouncedMinPrice === "0") {
            toast("warning", "El precio mínimo no puede ser 0. Por favor ingrese un valor mayor.")
        }

        if (debouncedMaxPrice === "0") {
            toast("warning", "El precio máximo no puede ser 0. Por favor ingrese un valor mayor.")
        }

        setFilters((prev) => ({
            ...prev,
            minPrice,
            maxPrice,
            name: debouncedName,
        }))
        setCurrentPage(1)
    }, [debouncedMinPrice, debouncedMaxPrice, debouncedName])

    const fetchProducts = useCallback(async () => {
        if (!token) {
            setError("No hay token disponible.")
            return
        }

        setIsFiltering(true)
        setError(null)

        const params = {
            page: currentPage,
            size: 12,
            category: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            tags: selectedTags.join(","),
            name: filters.name,
        }

        try {
            const response = await getProducts(params, token)
            setProducts(response.data || [])
            setTotalPages(response.totalPages || 1)
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Error al obtener los productos.")
            toast("error", "Error al cargar los productos. Por favor intente nuevamente.")
        } finally {
            setLoading(false)
            setIsFiltering(false)
        }
    }, [token, currentPage, filters, selectedTags])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    const preventInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "-" || e.key === "e") e.preventDefault()
    }

    const onTagsChange = (tags: string[]) => {
        setSelectedTags(tags)
        setCurrentPage(1)
    }

    const handleSearch = (query: string) => {
        setInputValues((prev) => ({
            ...prev,
            name: query,
        }))
    }

    const handleCategoryChange = (category: string) => {
        setInputValues((prev) => ({ ...prev, category }))
        setFilters((prev) => ({ ...prev, category }))
        setCurrentPage(1)
    }

    const handleClearCategory = () => {
        setInputValues((prev) => ({ ...prev, category: "" }))
        setFilters((prev) => ({ ...prev, category: "" }))
        setCurrentPage(1)
    }

    const handleMinPriceChange = (minPrice: string) => {
        if (minPrice === "0") {
            toast("warning", "El precio mínimo no puede ser 0. Ingrese un valor mayor.")
            return
        }
        setInputValues((prev) => ({ ...prev, minPrice }))
    }

    const handleMaxPriceChange = (maxPrice: string) => {
        if (maxPrice === "0") {
            toast("warning", "El precio máximo no puede ser 0. Ingrese un valor mayor.")
            return
        }
        setInputValues((prev) => ({ ...prev, maxPrice }))
    }

    const handleClearMinPrice = () => {
        setInputValues((prev) => ({ ...prev, minPrice: "" }))
        setFilters((prev) => ({ ...prev, minPrice: "" }))
        setCurrentPage(1)
    }

    const handleClearMaxPrice = () => {
        setInputValues((prev) => ({ ...prev, maxPrice: "" }))
        setFilters((prev) => ({ ...prev, maxPrice: "" }))
        setCurrentPage(1)
    }

    const handleClearAllFilters = () => {
        setInputValues({ category: "", minPrice: "", maxPrice: "", name: "" })
        setFilters({ category: "", minPrice: "", maxPrice: "", name: "" })
        setSelectedTags([])
        setCurrentPage(1)
        toast("info", "Todos los filtros han sido eliminados")
    }

    const handleRemoveTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag))
        setCurrentPage(1)
    }

    const hasActiveFilters =
        filters.category !== "" ||
        filters.minPrice !== "" ||
        filters.maxPrice !== "" ||
        filters.name !== "" ||
        selectedTags.length > 0

    if (loading && products.length === 0) {
        return <ProductCatalogSkeleton />
    }

    if (error && !loading && products.length === 0) {
        return (
            <div className="p-4 md:p-6 min-h-screen">
                <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setLoading(true)
                            fetchProducts()
                            toast("info", "Intentando cargar productos nuevamente...")
                        }}
                        className="mx-auto"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reintentar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="w-full mx-auto bg-gray-50 py-2">
                    <SearchBar onSearch={handleSearch} />

                    {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-[30%] bg-white rounded-lg border shadow-sm p-5 space-y-5 h-fit max-h-screen overflow-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold mb-[10px]">Filtros</h2>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAllFilters}
                                    className="text-xs h-8 px-2 text-gray-500 hover:text-gray-700"
                                >
                                    Limpiar todo
                                </Button>
                            )}
                        </div>
                        <label>Categoria</label>
                        <CategoryFilter
                            category={inputValues.category}
                            onCategoryChange={handleCategoryChange}
                            onClearCategory={handleClearCategory}
                        /><br />
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
                            <label className="block text-sm font-medium mb-2">Tags</label>
                            <TagFilter
                                title="Etiqueta"
                                selectedTags={selectedTags}
                                onChange={onTagsChange}
                                token={token || ""}
                            />
                        </div>
                    </aside>

                    <main className="flex-1 min-h-[800px]">
                        {isFiltering && (
                            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md mb-4 flex items-center text-sm">
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Actualizando resultados...
                            </div>
                        )}

                        {products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-3 gap-4 lg:w-[970px]">
                                    {products.slice(0, 12).map((product) => (
                                        <Card
                                            key={product.id}
                                            title={product.name}
                                            description={`${product.price.toLocaleString()} Gs.`}
                                            image={product.image?.originalUrl ?? NotImageNicoPets.src}
                                            ctaText="Ver detalles"
                                            ctaLink={`/user-profile/product/${product.id}`}
                                            tags={product.tags}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center lg:w-[970px] bg-white border rounded-lg shadow-sm p-10 text-center min-h-[400px]">
                                <SearchX className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron productos</h3>
                                <p className="text-gray-500 max-w-md mb-6">
                                    No hay productos que coincidan con los filtros seleccionados. Intenta modificar tus criterios de búsqueda.
                                </p>
                                {hasActiveFilters && (
                                    <Button onClick={handleClearAllFilters} className="flex items-center">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Limpiar todos los filtros
                                    </Button>
                                )}
                            </div>
                        )}

                        {products.length > 0 && (
                            <div className="mt-8">
                                <GenericPagination
                                    handlePreviousPage={() => handlePageChange(currentPage - 1)}
                                    handlePageChange={handlePageChange}
                                    handleNextPage={() => handlePageChange(currentPage + 1)}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ProductCatalog
