"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { usePurchase } from "@/hooks/purchases/usePurchase";
import { getProviders } from "@/lib/provider/getProviders";
import { getProducts } from "@/lib/products/getProducts";
import { getStocks } from "@/lib/stock/getStock";
import SearchBar from "@/components/global/SearchBar";
import { Product } from "@/lib/products/IProducts";
import { StockData } from "@/lib/stock/IStock";
import { Provider } from "@/lib/provider/IProvider";

interface PurchaseFormData {
  providerId: number;
  stockId: number;
  date: string;
  details: Array<{
    productId: number;
    quantity: number;
  }>;
}

export default function PurchaseForm({ token }: { token: string }) {
  const { register, handleSubmit, addProduct, submitPurchase, errors } =
    usePurchase(token);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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

      const productResponse = await getProducts({ page: 1, size: 10 }, token);
      setProducts(productResponse.data);
      setSearchProducts(productResponse.data);
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (searchQuery) {
        const productResponse = await getProducts({ page: 1, size: 10 }, token);
        setSearchProducts(productResponse.data);
      } else {
        setSearchProducts(products);
      }
    };
    fetchFilteredProducts();
  }, [searchQuery, products, token]);

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

  const onSubmit = async (data: PurchaseFormData) => {
    const success = await submitPurchase(data);
    if (success) {
      // Redirección o mensaje de éxito
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-16 p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-6 border rounded-lg shadow-md"
      >
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Select {...register("providerId")}>
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
          {errors.providerId && (
            <p className="text-red-500 text-sm">{errors.providerId.message}</p>
          )}

          <Select {...register("stockId")}>
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
            placeholder="Buscar producto..."
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
                    type="button"
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

          {errors.details && (
            <p className="text-red-500 text-sm">{errors.details.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancelar</Button>
          <Button type="submit">Registrar Compra</Button>
        </div>
      </form>
    </div>
  );
}
