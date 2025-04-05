"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Purchase } from "@/lib/purchases/IPurchase";
import { Product } from "@/lib/products/IProducts";
import { usePurchase } from "@/hooks/purchases/usePurchase";
import { useInitialData } from "@/hooks/purchases/useProviderStock";
import { useProductSearch } from "@/hooks/purchases/useProductSearch";
import ProductSearch from "./PurchaseItemSearch";
import ProductList from "./PurchaseItems";
import { useRouter } from "next/navigation";
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
    updateQuantity,
    isSubmitting,
  } = usePurchase(token);
  const { providers, stocks } = useInitialData(token);
  const {
    searchProducts,
    searchQuery,
    hasSearched,
    handleSearchProduct,
    getProductQuantity,
    setProductQuantity,
    resetSearch,
    isLoading,
  } = useProductSearch(token);
  const details = watch("details") || [];
  const router = useRouter();
  const handleAddProduct = (product: Product, quantity: number) => {
    if (quantity > 0) {
      addProduct(product, quantity);
      resetSearch();
    }
  };
  const onSubmit = async (data: Purchase) => {
    const formattedData = {
      ...data,
      date: new Date(data.date).toISOString(),
    };
    const success= await submitPurchase(formattedData);
    if (success) {
      router.push("/dashboard/purchases");
    } else {
      router.refresh();
    }
  };
  return (
    <div className="flex flex-col justify-center items-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold mb-6">Registrar Compra</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Proveedor</label>
            <Controller
              name="providerId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.providerId ? "border-red-500" : ""
                    }`}
                  >
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
              <p className="text-red-500 text-sm">
                {errors.providerId.message}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Depósito</label>
            <Controller
              name="stockId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.stockId ? "border-red-500" : ""
                    }`}
                  >
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
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Fecha</label>
            <Input
              type="date"
              className={`w-full ${errors.date ? "border-red-500" : ""}`}
              {...register("date")}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
        </div>
        <ProductSearch
          searchProducts={searchProducts}
          searchQuery={searchQuery}
          hasSearched={hasSearched}
          onSearch={handleSearchProduct}
          getQuantity={getProductQuantity}
          setQuantity={setProductQuantity}
          onAddProduct={handleAddProduct}
          resetSearch={resetSearch}
          isLoading={isLoading}
        />
        {details.length > 0 && (
          <>
            <h2 className="mb-6">Productos Seleccionados</h2>
            <ProductList details={details} onRemove={removeProduct} onUpdateQuantity={updateQuantity}
            />
          </>
        )}
        {errors.details && (<p className="text-red-500 text-sm mt-2">{errors.details.message}</p>)}
        <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" type="button" onClick={() => router.push("/dashboard/purchases")}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registrando..." : "Registrar Compra"}</Button>
        </div>
      </form>
    </div>
  );
}
