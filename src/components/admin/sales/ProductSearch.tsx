"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command"
import { ProductWithExtraData as Product } from "@/lib/products/IProducts"

import { useFetch } from "@/hooks/api/useFetch"
import { PRODUCT_API } from "@/lib/urls"
import SearchBar from "@/components/global/SearchBar"

type ProductSearchProps = {
  onSelectProduct: (product: Product) => void
  token: string
  stockId: string
}

export default function ProductSearch({ onSelectProduct, token,stockId }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  // Using useFetch to get products with filtering
  const { data, loading, error, get } = useFetch<{ data: Product[] }>("", token)

  // Fetch products when search term changes (with debounce)
  useEffect(() => {
    if(searchTerm && stockId){
        get(undefined, `${PRODUCT_API}?name=${encodeURIComponent(searchTerm)}&stockId=${stockId}&page=1&size=5`);
    }
  }, [searchTerm,stockId]);

  // Update products when data changes
  useEffect(() => {
    if (data?.data) {
      const mappedProducts = data.data.map((product) => ({
        ...product,
        quantity: 1,
        total: product.price,
      }))
      setProducts(mappedProducts)
    }
  }, [data])

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product)
    setSearchTerm("")
    setIsCommandOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchTerm(query)
    setIsCommandOpen(!!query)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="flex w-full items-center space-x-2">
            <SearchBar
              onSearch={handleSearch}
              defaultQuery={searchTerm}
              debounceDelay={400}
              placeholder="Buscar por código o nombre del producto"
            />
          </div>

          {isCommandOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1">
              <Command className="rounded-lg border shadow-md">
                <CommandList>
                  {
                    loading ? (
                      <CommandEmpty>Cargando...</CommandEmpty>
                    ) : error ? (
                      <CommandEmpty>{error.message}</CommandEmpty>
                    ) : products.length === 0 ? (
                      <CommandEmpty>No se encontraron productos</CommandEmpty>
                    ) : (
                      products.map((product) => (
                        <CommandItem key={product.id} onSelect={() => handleSelectProduct(product)}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{product.name}</span>
                              <span className="text-xs text-muted-foreground">{product.code}</span>
                            </div>
                            <span className="text-sm font-medium">{product.price.toLocaleString("ES-PY")} Gs.</span>
                          </div>
                        </CommandItem>
                      ))
                    )
                  }
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
