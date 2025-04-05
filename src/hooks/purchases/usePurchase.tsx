import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema } from "@/lib/purchases/purchaseSchema";
import { registerPurchase } from "@/lib/purchases/registerPurchase";
import { ExtendedPurchase } from "@/lib/purchases/IPurchase";
import { Product } from "@/lib/products/IProducts";
import { toast } from "@/lib/toast";

export const usePurchase = (token: string) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExtendedPurchase>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      providerId: undefined,
      stockId: undefined,
      date: new Date().toISOString().split("T")[0],
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
          code: product.code,
          name: product.name,
        },
      ]);
    }
  };
  const updateQuantity = (productId: number, newQuantity: number) => {
    const currentDetails = getValues("details") || [];
    const updatedDetails = currentDetails.map((detail) =>
      detail.productId === productId
        ? { ...detail, quantity: newQuantity }
        : detail
    );
    setValue("details", updatedDetails);
  };
  const removeProduct = (productId: number) => {
    const currentDetails = getValues("details") || [];
    const filtered = currentDetails.filter(
      (detail) => detail.productId !== productId
    );
    setValue("details", filtered);
  };

  const submitPurchase = async (data: ExtendedPurchase) => {
    const detailsToSend = data.details.map((detail) => ({
      productId: detail.productId,
      quantity: detail.quantity,
    }));

    const payload = {
      providerId: data.providerId,
      stockId: data.stockId,
      date: data.date,
      details: detailsToSend,
    };

    try {
      await registerPurchase(payload, token);
      toast("success","Compra registrada con exito!")
      reset();
      return true;
    } catch (error) {
      toast("error", error instanceof Error ? error.message : "Ocurrió un error. Intenta nuevamente.");
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
    reset,
    updateQuantity,
    isSubmitting,
  };
};

