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
    totalCostMin?: string
    totalCostMax?: string
    ivaCostMin?: string
    ivaCostMax?: string
    dateFrom?: string
    dateTo?: string
  }) => void
}

const PurchaseFilter = ({ provider, deposito, token, onFilterChange }: PurchaseFilterProps) => {
  const [providers, setProviders] = useState<Provider[]>([])
  const [stocks, setStocks] = useState<StockData[]>([])
  const [filters, setFilters] = useState({
    provider,
    deposito,
    totalCostMin: "",
    totalCostMax: "",
    ivaCostMin: "",
    ivaCostMax: "",
    dateFrom: "",
    dateTo: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updated = { ...filters, [name]: value }
    setFilters(updated)
    onFilterChange(updated)
  }

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

          <div className="flex flex-col w-full mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Costo total</label>
                <div className="flex gap-2">
                  <Input
                    name="totalCostMin"
                    type="number"
                    placeholder="Desde"
                    value={filters.totalCostMin}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <Input
                    name="totalCostMax"
                    type="number"
                    placeholder="Hasta"
                    value={filters.totalCostMax}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">Costo IVA</label>
                <div className="flex gap-2">
                  <Input
                    name="ivaCostMin"
                    type="number"
                    placeholder="Desde"
                    value={filters.ivaCostMin}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <Input
                    name="ivaCostMax"
                    type="number"
                    placeholder="Hasta"
                    value={filters.ivaCostMax}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <div className="flex gap-2 flex-wrap">
              <div className="w-72">
              <label className="text-xs text-gray-500">Fecha desde</label>
                <Input
                  name="dateFrom"
                  type="date"
                  placeholder="Fecha desde"
                  value={filters.dateFrom}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="w-72">
              <label className="text-xs text-gray-500">Fecha hasta</label>
                <Input
                  name="dateTo"
                  type="date"
                  placeholder="Fecha hasta"
                  value={filters.dateTo}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseFilter

