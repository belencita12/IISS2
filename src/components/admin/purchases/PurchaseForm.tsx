"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Trash } from "lucide-react";
import { usePurchase } from "@/hooks/purchases/usePurchase";
import { getProviders } from "@/lib/provider/getProviders";
import { getProducts } from "@/lib/products/getProducts";
import { getStocks } from "@/lib/stock/getStock";
import SearchBar from "@/components/global/SearchBar";
import { Product, ProductQueryParams } from "@/lib/products/IProducts";
import { StockData } from "@/lib/stock/IStock";
import { Provider } from "@/lib/provider/IProvider";
import { Controller } from "react-hook-form";
import { Purchase } from "@/lib/purchases/IPurchase";

interface ExtendedProductQueryParams extends ProductQueryParams {
  name?: string;
}

export default function PurchaseForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    submitPurchase,
    addProduct,
    errors,
    control,
    removeProduct,
    watch,
  } = usePurchase(token);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  useEffect(() => {
    const fetchData = async () => {
      const providerResponse = await getProviders(token, { page: 1, size: 10 });
      setProviders(providerResponse.data);

      const stockResponse = await getStocks({ page: 1, size: 10 }, token);
      setStocks(stockResponse.data);
    };
    fetchData();
  }, [token]);
  const details = watch("details");

  const fetchProducts = useCallback(
    async (query: string) => {
      const params: ExtendedProductQueryParams = {
        page: 1,
        size: 10,
        name: query,
      };
      const productResponse = await getProducts(params, token);
      setSearchProducts(productResponse.data);
    },
    [token]
  );

  useEffect(() => {
    if (searchQuery) {
      fetchProducts(searchQuery);
    } else {
      setSearchProducts([]);
    }
  }, [searchQuery, token, fetchProducts]);

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      addProduct(selectedProduct, quantity);
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  const handleSearchProduct = (query: string) => {
    setSearchQuery(query);
  };

  const onSubmit = async (data: Purchase) => {
    const formattedData = { ...data, date: new Date(data.date).toISOString() };
    console.log("Datos a enviar:", formattedData);
    const purchaseData = {
      ...formattedData,
      details: details,
    };

    console.log("Compra con productos:", purchaseData);

    const success = await submitPurchase(purchaseData);
    if (success) {
      alert("Compra registrada correctamente");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-16 p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-6 border rounded-lg shadow-md"
      >
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Controller
            name="providerId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={String(provider.id)}>
                      {provider.businessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.providerId && (
            <p className="text-red-500 text-sm">{errors.providerId.message}</p>
          )}

          {/* Sucursal */}
          <Controller
            name="stockId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {stocks.map((stock) => (
                    <SelectItem key={stock.id} value={String(stock.id)}>
                      {stock.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.stockId && (
            <p className="text-red-500 text-sm">{errors.stockId.message}</p>
          )}
          <Input type="date" {...register("date")} />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>
        <div className="border rounded-md p-4 mb-4">
          <SearchBar
            onSearch={handleSearchProduct}
            placeholder="Buscar por nombre del  producto..."
          />
          <div className="flex flex-col gap-2 mt-2">
            {searchProducts.length > 0 ? (
              searchProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 justify-between"
                >
                  <span className="text-sm flex-1">
                    {product.name} - {product.price} USD
                  </span>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    className="w-24"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <Button
                    variant="outline" type="button"
                    onClick={() => {
                      setSelectedProduct(Number(product.id));
                      handleAddProduct();
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-500">
                No hay productos para mostrar.
              </span>
            )}
          </div>
        </div>
        {details.length > 0 && (
          <div className="border rounded-md p-4 mb-4">
            <h3>Productos seleccionados</h3>
            <ul>
              {details.map((product) => (
                <li key={product.productId} className="flex justify-between">
                  <span>
                    Producto {product.productId} - Cantidad: {product.quantity}
                  </span>
                  <Button
                    type="button" variant="ghost"
                    onClick={() => removeProduct(product.productId)}
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
          <Button type="submit">Registrar Compra</Button>
        </div>
      </form>
    </div>
  );
}
