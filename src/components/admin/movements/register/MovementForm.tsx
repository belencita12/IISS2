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
import { useProductStock } from "@/hooks/purchases/useProductStock";
import MovementEmployeeSearch from "../MovementEmployeeSearch";
import MovementStockSelector from "../MovementStockSelector";
import { Product } from "@/lib/products/IProducts";
import { Movement } from "@/lib/movements/IMovements";
import { useInitialData } from "@/hooks/purchases/useProviderStock";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { useEmployeeSearch } from "@/hooks/employees/useEmployeeSearch";
import MovementEmployeeSelected from "../MovementEmployeeSelected";
import { useTranslations } from "next-intl";

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
const selectedStockId = watch("originStockId") ?? null;
const movementType = watch("type"); // Obtener el tipo de movimiento

const {
  searchProducts,
  searchQuery,
  hasSearched: hasSearchedProduct,
  handleSearchProduct,
  getProductQuantity,
  setProductQuantity,
  resetSearch,
  isLoading: isLoadingProduct,
} = useProductStock(token, selectedStockId, movementType); 


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
  

  const t = useTranslations();

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

  const minDate = "1900-01-01";
  const maxDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  })();

  return (
    <div className="flex flex-col justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full  bg-white p-8  space-y-8"
      >
         <fieldset disabled={isSubmitting} className="space-y-8">
        <h2 className="text-3xl font-bold mb-4 text-start">{t("movement.form.title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">{t("movement.form.typeOfMovement")}</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder={t("placeholder.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INBOUND">{t("movement.type.inbound")}</SelectItem>
                    <SelectItem value="OUTBOUND">{t("movement.type.outbound")}</SelectItem>
                    <SelectItem value="TRANSFER">{t("movement.type.transfer")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type?.message}</p>}
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
            <label className="text-sm font-medium mb-1">{t("movement.form.date")}</label>
            <Input
              type="date"
              {...register("dateMovement")}
              min={minDate}
              max={maxDate}
              className={errors.dateMovement ? "border-red-500" : ""}
              onBlur={(e) => {
                let value = e.target.value;
                if (value && (value < minDate || value > maxDate)) {
                  value = value < minDate ? minDate : maxDate;
                  setValue("dateMovement", value, { shouldValidate: true });
                }
              }}
            />
            {errors.dateMovement && <p className="text-red-500 text-sm">{errors.dateMovement.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">{t("movement.form.description")}</label>
            <Input placeholder="Descripción del movimiento" {...register("description")}
              className={errors.description ? "border-red-500" : ""} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
        </div>

        <div className="p-6 border rounded-xl bg-gray-50">
          <h3 className="font-semibold text-lg mb-4">{t("movement.form.selectEmployee")}</h3>
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
                setValue("managerId", 0,{ shouldValidate: true });
              }}
            />
          )}
        </div>

        <div className="p-6 border rounded-xl bg-gray-50">
          <h3 className="font-semibold text-lg mb-4">{t("movement.form.movementProducts")}</h3>
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
              <h4 className="font-medium text-sm mt-6 mb-2">{t("movement.form.selectedProducts")}</h4>
              <ProductList
                details={details}
                onRemove={removeProduct}
                onUpdateQuantity={updateQuantity}
              />
            </>
          )}
          {errors.details && <p className="text-red-500 text-sm mt-2">{errors.details.message}</p>}
        </div>
        </fieldset>
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/movement")} disabled={isSubmitting} >{t("button.cancel")}</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("button.registering") : t("button.register")}
          </Button>
        </div>
      </form>
    </div>
  );
}