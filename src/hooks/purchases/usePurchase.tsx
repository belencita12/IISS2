import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema } from "@/lib/purchases/purchaseSchema";
import { registerPurchase } from "@/lib/purchases/registerPurchase";
import { Purchase } from "@/lib/purchases/IPurchase";
import { Product } from "@/lib/products/IProducts";

export const usePurchase = (token: string) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
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

  const addProduct = (product: Product, quantity: number) => {
    const currentDetails = getValues("details") || [];
  
    const existingIndex = currentDetails.findIndex(
      (detail) => detail.productId === Number(product.id)
    );
  
    if (existingIndex >= 0) {
      const updatedDetails = [...currentDetails];
      updatedDetails[existingIndex].quantity = quantity;
      setValue("details", updatedDetails);
    } else {
      setValue("details", [
        ...currentDetails,
        {
          productId: Number(product.id),
          quantity,
        },
      ]);
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
    console.log("Datos a enviar:", data);
    try {
      await registerPurchase(data, token);
      alert("Compra registrada exitosamente");
      reset();
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
    control,
    errors,
  };
};
