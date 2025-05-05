"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command"
import { ProductWithExtraData as Product } from "@/lib/products/IProducts"

import { useFetch } from "@/hooks/api/useFetch"
import { PRODUCT_API, STOCK_DETAILS_API } from "@/lib/urls"
import SearchBar from "@/components/global/SearchBar"

type ProductSearchProps = {
  onSelectProduct: (product: Product) => void
  token: string
  stockId: string
}

type StockProductResponse = {
  stockId: number;
  amount: number;
  product: Product;
};


export default function ProductSearch({ onSelectProduct, token, stockId }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  const { get } = useFetch<{ data: Product[] }>("", token)
  const { get:anotherGet } = useFetch<{ data: StockProductResponse []}>("", token)

  // Fetch products + services when search term changes
  useEffect(() => {
    if (searchTerm && stockId) {
      // Productos (con stockId)
      const productsPromise = anotherGet(undefined, `${STOCK_DETAILS_API}?productSearch=${encodeURIComponent(searchTerm)}&stockId=${stockId}&fromAmount=1&page=1&size=5`)

      // Servicios (sin stockId)
      const servicesPromise = get(undefined, `${PRODUCT_API}?name=${encodeURIComponent(searchTerm)}&category=SERVICE&page=1&size=5`)

      Promise.all([productsPromise, servicesPromise]).then(([{data:productsRes}, {data:servicesRes}]) => {
        const productsDatas = productsRes?.data || []
        const productsData = productsDatas.map((product) => ({
          ...product.product,
          quantity: product.amount,
          total: product.product.price,
        }))

        const servicesData = servicesRes?.data || []

        const combined = [...productsData, ...servicesData].map((product) => ({
          ...product,
          quantity: 1,
          total: product.price,
        }))

        setProducts(combined)
      })
    }
  }, [searchTerm, stockId])

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product)
    setSearchTerm("")
    setIsCommandOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchTerm(query)
    setIsCommandOpen(!!query)
  }

  const formatCategory = (category: string) => {
    return category === "SERVICE" ? "Servicio" : category === "PRODUCT" ? "Producto" : category
  }

  console.log("Products fetched:", products)

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
                  {products.length === 0 ? (
                    <CommandEmpty>No se encontraron productos ni servicios</CommandEmpty>
                  ) : (
                    products.map((product) => (
                      <CommandItem key={product.id} onSelect={() => handleSelectProduct(product)}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{product.name}</span>
                            <span className="text-xs text-muted-foreground">{product.code} • {formatCategory(product.category)}</span>
                          </div>
                          <span className="text-sm font-medium">{product?.price?.toLocaleString("ES-PY")} Gs.</span>
                        </div>
                      </CommandItem>
                    ))
                  )}
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
