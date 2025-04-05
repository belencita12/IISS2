"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getProviders } from "@/lib/provider/getProviders"
import { getStocks } from "@/lib/stock/getStock"
import type { Provider } from "@/lib/provider/IProvider"
import type { StockData } from "@/lib/stock/IStock"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/toast"

interface PurchaseFilterProps {
  provider: string
  deposito: string
  token: string
  onFilterChange: (filters: {
    provider: string
    deposito: string
  }) => void
}

const PurchaseFilter = ({ provider, deposito, token, onFilterChange }: PurchaseFilterProps) => {
  const [providers, setProviders] = useState<Provider[]>([])
  const [stocks, setStocks] = useState<StockData[]>([])
  const [filters, setFilters] = useState({
    provider,
    deposito,

  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const providerResponse = await getProviders(token, { page: 1, size: 100 })
        setProviders(providerResponse.data)

        const stockResponse = await getStocks({ page: 1, size: 100 }, token)
        setStocks(stockResponse.data)
      } catch (error: unknown) {
        if (error instanceof Error) toast("error", error.message)
      }
    }

    fetchData()
  }, [token])


  const handleSelectChange = (name: string, value: string) => {
    const updated = { ...filters, [name]: value }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="bg-white rounded-lg mb-6">
      <div className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-4 w-full mb-4">
            <div className="w-full md:w-[calc(50%-8px)]">
              <Select value={filters.provider} onValueChange={(value) => handleSelectChange("provider", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proveedores</SelectItem>
                  {providers &&
                    providers.map((prov) => (
                      <SelectItem key={prov.id} value={prov.id?.toString() || ""}>
                        {prov.businessName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-[calc(50%-8px)]">
              <Select value={filters.deposito} onValueChange={(value) => handleSelectChange("deposito", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Depósito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los depósitos</SelectItem>
                  {stocks &&
                    stocks.map((stock) => (
                      <SelectItem key={stock.id} value={stock.id?.toString() || ""}>
                        {stock.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PurchaseFilter

