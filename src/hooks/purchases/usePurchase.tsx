import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema } from "@/lib/purchases/purchaseSchema";
import { registerPurchase } from "@/lib/purchases/registerPurchase";
import { Purchase } from "@/lib/purchases/IPurchase";

export const usePurchase = (token: string) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<Purchase>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      providerId: undefined,
      stockId: undefined,
      date: new Date().toISOString().split("T")[0], // Fecha actual como valor predeterminado
      details: [],
    },
  });

  const addProduct = (productId: number, quantity: number) => {
    const currentDetails = getValues("details") || [];

    // Verificar si el producto ya existe en los detalles
    const existingIndex = currentDetails.findIndex(
      (detail) => detail.productId === productId
    );

    if (existingIndex >= 0) {
      // Actualizar la cantidad si el producto ya existe
      const updatedDetails = [...currentDetails];
      updatedDetails[existingIndex].quantity = quantity;
      setValue("details", updatedDetails);
    } else {
      // Agregar nuevo producto si no existe
      setValue("details", [...currentDetails, { productId, quantity }]);
    }
  };

  const removeProduct = (productId: number) => {
    const currentDetails = getValues("details") || [];
    setValue(
      "details",
      currentDetails.filter((detail) => detail.productId !== productId)
    );
  };

  const submitPurchase = async (data: Purchase) => {
    try {
      await registerPurchase(data, token);
      alert("Compra registrada exitosamente");
      reset(); // Limpiar el formulario después de un registro exitoso
      return true;
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      alert("Error al registrar la compra");
      return false;
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    getValues,
    addProduct,
    removeProduct,
    submitPurchase,
    watch,
    errors,
  };
};
