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
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductSearch from "../../purchases/PurchaseItemSearch";
import ProductList from "../../purchases/PurchaseItems";
import { useRegisterMovement } from "@/hooks/movements/useRegisterMovements";
import { useProductSearch } from "@/hooks/purchases/useProductSearch";
import MovementEmployeeSearch from "../MovementEmployeeSearch";
import { Product } from "@/lib/products/IProducts";
import { Movement } from "@/lib/movements/IMovements";
import { useInitialData } from "@/hooks/purchases/useProviderStock";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { useEmployeeSearch } from "@/hooks/employees/useEmployeeSearch";

export default function MovementForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    errors,
    isSubmitting,
    addProduct,
    removeProduct,
    updateQuantity,
    submitMovement,
  } = useRegisterMovement(token);

  const { stocks } = useInitialData(token);
  const {
    searchProducts,
    searchQuery,
    hasSearched: hasSearchedProduct,
    handleSearchProduct,
    getProductQuantity,
    setProductQuantity,
    resetSearch,
    isLoading: isLoadingProduct,
  } = useProductSearch(token);

  const {
    employees,
    isLoading,
    hasSearched,
    searchEmployees,
    resetSearch: resetEmployeeSearch,
    hasSearched: hasSearchedEmployee,
  } = useEmployeeSearch(token);

  const router = useRouter();
  const details = watch("details") || [];
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);

  const handleAddProduct = (product: Product, quantity: number) => {
    if (quantity > 0) {
      addProduct(product, quantity);
      resetSearch();
    }
  };

  const handleAddEmployee = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    if (employee.id) {
      setValue("managerId", employee.id);
    }
  };

  const onSubmit = async (data: Movement) => {
      const formattedData = {
        ...data,
        date: new Date(data.dateMovement).toISOString(),
      };
      await submitMovement(formattedData);
    };
  return (
    <div className="flex flex-col justify-center items-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold mb-6">Registrar Movimiento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Select de origen */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Depósito Origen</label>
            <Controller
              name="originStockId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className={errors.originStockId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar origen" />
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
            {errors.originStockId && (
              <p className="text-red-500 text-sm">{errors.originStockId.message}</p>
            )}
          </div>

          {/* Select de destino */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Depósito Destino</label>
            <Controller
              name="destinationStockId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className={errors.destinationStockId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar destino" />
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
            {errors.destinationStockId && (
              <p className="text-red-500 text-sm">{errors.destinationStockId.message}</p>
            )}
          </div>

          {/* Fecha */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Fecha</label>
            <Input
              type="date"
              {...register("dateMovement")}
              className={errors.dateMovement ? "border-red-500" : ""}
            />
            {errors.dateMovement && (
              <p className="text-red-500 text-sm">{errors.dateMovement.message}</p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Descripción</label>
          <Input
            type="text"
            placeholder="Descripción del movimiento"
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Selector de empleado */}
        <MovementEmployeeSearch
          searchEmployees={employees}
          onSearch={searchEmployees}
          onSelect={handleAddEmployee}
          resetSearch={resetEmployeeSearch}
          isLoading={isLoading}
          hasSearched={hasSearchedEmployee}
        />
        {errors.managerId && (
          <p className="text-red-500 text-sm mt-2">{errors.managerId.message}</p>
        )}

        {selectedEmployee && (
          <div className="p-4 border mt-4 rounded-md">
            <h3 className="font-semibold">Empleado Seleccionado</h3>
            <p><strong>Nombre:</strong> {selectedEmployee.fullName}</p>
            <p><strong>RUC:</strong> {selectedEmployee.ruc}</p>
          </div>
        )}

        {/* Productos */}
        <ProductSearch
          searchProducts={searchProducts}
          searchQuery={searchQuery}
          hasSearched={hasSearchedProduct}
          onSearch={handleSearchProduct}
          getQuantity={getProductQuantity}
          setQuantity={setProductQuantity}
          onAddProduct={handleAddProduct}
          resetSearch={resetSearch}
          isLoading={isLoadingProduct}
        />

        {details.length > 0 && (
          <>
            <h2 className="p-4 font-bold">Productos Seleccionados</h2>
            <ProductList
              details={details}
              onRemove={removeProduct}
              onUpdateQuantity={updateQuantity}
            />
          </>
        )}
        {errors.details && (
          <p className="text-red-500 text-sm mt-2">{errors.details.message}</p>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/movements")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar Movimiento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
