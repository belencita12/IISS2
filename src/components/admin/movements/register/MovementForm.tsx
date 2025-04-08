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
import MovementStockSelector from "../MovementStockSelector";
import { Product } from "@/lib/products/IProducts";
import { Movement } from "@/lib/movements/IMovements";
import { useInitialData } from "@/hooks/purchases/useProviderStock";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { useEmployeeSearch } from "@/hooks/employees/useEmployeeSearch";
import MovementEmployeeSelected from "../MovementEmployeeSelected";

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
      setValue("managerId", employee.id, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: Movement) => {
    if (!data.dateMovement ) return;
    const formattedData = {
      ...data,
      dateMovement: new Date(data.dateMovement).toISOString(),
    };
    const success = await submitMovement(formattedData);
    if (success) {
      router.push("/dashboard/movement");
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full  bg-white p-8  space-y-8"
      >

        <h2 className="text-3xl font-bold mb-4 text-start">Registrar Movimiento</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Tipo de Movimiento</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INBOUND">Ingreso</SelectItem>
                    <SelectItem value="OUTBOUND">Egreso</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          <MovementStockSelector
            type={watch("type")}
            stocks={stocks}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Fecha</label>
            <Input type="date" {...register("dateMovement")} max={new Date().toISOString().split("T")[0]} className={errors.dateMovement ? "border-red-500" : ""} />
            {errors.dateMovement && <p className="text-red-500 text-sm">{errors.dateMovement.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Descripción</label>
            <Input placeholder="Descripción del movimiento" {...register("description")}
              className={errors.description ? "border-red-500" : ""} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
        </div>

        <div className="p-6 border rounded-xl bg-gray-50">
          <h3 className="font-semibold text-lg mb-4">Seleccionar Empleado</h3>
          <MovementEmployeeSearch
            searchEmployees={employees}
            onSearch={searchEmployees}
            onSelect={handleAddEmployee}
            resetSearch={resetEmployeeSearch}
            isLoading={isLoading}
            hasSearched={hasSearchedEmployee}
          />
          {errors.managerId && <p className="text-red-500 text-sm mt-2">{errors.managerId.message}</p>}
          {selectedEmployee && (
            <MovementEmployeeSelected
              employee={selectedEmployee}
              onRemove={() => {
                setSelectedEmployee(null);
                setValue("managerId", 0, { shouldValidate: true });
              }}
            />
          )}
        </div>

        <div className="p-6 border rounded-xl bg-gray-50">
          <h3 className="font-semibold text-lg mb-4">Productos del Movimiento</h3>
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
              <h4 className="font-medium text-sm mt-6 mb-2">Productos Seleccionados</h4>
              <ProductList
                details={details}
                onRemove={removeProduct}
                onUpdateQuantity={updateQuantity}
              />
            </>
          )}
          {errors.details && <p className="text-red-500 text-sm mt-2">{errors.details.message}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/movement")}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar Movimiento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
