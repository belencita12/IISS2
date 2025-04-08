// hooks/movements/useMovement.ts

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { movementSchema } from "@/lib/movements/movementSchema";
import { registerMovement } from "@/lib/movements/registerMovement";
import { ExtendedMovement } from "@/lib/movements/IMovements";
import { Product } from "@/lib/products/IProducts";
import { toast } from "@/lib/toast";

export const useRegisterMovement = (token: string) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExtendedMovement>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      originStockId: undefined,
      destinationStockId: undefined,
      managerId: undefined,
      type: "INBOUND",
      description: "",
      dateMovement: new Date().toISOString().split("T")[0],
      details: [],
    },
  });

  const addProduct = (product: Product, quantity: number) => {
    const currentDetails = getValues("details") || [];
    const existingIndex = currentDetails.findIndex(
      (detail) => detail.productId === Number(product.id)
    );

    if (existingIndex >= 0) {
      const updatedDetails = [...currentDetails];
      updatedDetails[existingIndex].quantity += quantity;
      setValue("details", updatedDetails);
    } else {
      setValue("details", [
        ...currentDetails,
        {
          productId: Number(product.id),
          quantity,
          code: product.code,
          name: product.name,
        },
      ]);
    }
  };

  const removeProduct = (productId: number) => {
    const currentDetails = getValues("details") || [];
    setValue("details", currentDetails.filter((d) => d.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const currentDetails = getValues("details") || [];
    setValue(
      "details",
      currentDetails.map((d) =>
        d.productId === productId ? { ...d, quantity } : d
      )
    );
  };

  const submitMovement = async (data: ExtendedMovement) => {
    try {
      const movementData = {
        type: data.type,
        description: data.description,
        originStockId: data.originStockId,
        destinationStockId: data.destinationStockId,
        managerId: data.managerId,
        dateMovement: data.dateMovement,
        details: data.details.map((d) => ({
          productId: d.productId,
          quantity: d.quantity,
        })),
      };

      await registerMovement(movementData, token);
      console.log("Enviando datos:", movementData);
      toast("success", "Movimiento registrado con éxito!");
      reset();
      return true;
      
    } catch (error:unknown) {
      toast(
        "error",
        error instanceof Error ? error.message : "Error al registrar movimiento"
      );
      return false;
    }
  };

  return {
    register,
    handleSubmit,
    control,
    watch,
    errors,
    isSubmitting,
    addProduct,
    removeProduct,
    updateQuantity,
    submitMovement,
    setValue,
  };
};
