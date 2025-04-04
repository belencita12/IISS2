"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Select,SelectTrigger, SelectContent, SelectItem,SelectValue, } from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Purchase } from "@/lib/purchases/IPurchase";
import { Product } from "@/lib/products/IProducts";
import { usePurchase } from "@/hooks/purchases/usePurchase";
import { useInitialData } from "@/hooks/purchases/useProviderStock";
import { useProductSearch } from "@/hooks/purchases/useProductSearch";
import ProductSearch from "./PurchaseItemSearch";
import ProductList from "./PurchaseItems";

export default function PurchaseForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    submitPurchase,
    addProduct,
    removeProduct,
    errors,
    control,
    watch,
  } = usePurchase(token);

  const { providers, stocks } = useInitialData(token);
  const {
    searchProducts,
    handleSearchProduct,
    quantity,
    setQuantity,
  } = useProductSearch(token);
  const details = watch("details");

  const handleAddProduct = (product: Product) => {
    if (quantity > 0) {
      addProduct(product, quantity);
      setQuantity(1);
    }
  };
  const onSubmit = async (data: Purchase) => {
    const formattedData = {
      ...data,
      date: new Date(data.date).toISOString(),
    };
    await submitPurchase(formattedData);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-16 p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-6">
      <h2 className="text-3xl font-bold p-6">Registrar Compra</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Controller
            name="providerId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
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
          <Controller
            name="stockId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar depósito" />
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
        <ProductSearch
          searchProducts={searchProducts}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onSearch={handleSearchProduct}
          onAddProduct={handleAddProduct}
        />
        <ProductList details={details} onRemove={removeProduct} />
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">Cancelar</Button>
          <Button type="submit">Registrar Compra</Button>
        </div>
      </form>
    </div>
  );
}
