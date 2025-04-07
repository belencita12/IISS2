import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema } from "@/lib/purchases/purchaseSchema";
import { registerPurchase } from "@/lib/purchases/registerPurchase";
import { ExtendedPurchase } from "@/lib/purchases/IPurchase";
import { Product } from "@/lib/products/IProducts";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    setValue("details", 
      currentDetails.filter(detail => detail.productId !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const currentDetails = getValues("details") || [];
    setValue("details", 
      currentDetails.map(detail =>
        detail.productId === productId 
          ? { ...detail, quantity } 
          : detail
      )
    );
  };

  const submitPurchase = async (data: ExtendedPurchase) => {
    try {
      const purchasesData = {
        providerId: data.providerId,
        stockId: data.stockId,
        date: data.date,
        details: data.details.map(d => ({
          productId: d.productId,
          quantity: d.quantity,
        })),
      };
      await registerPurchase(purchasesData, token);
      toast("success", "Compra registrada con éxito!");
      reset();
      router.push("/dashboard/purchases")
    } catch (error) {
      toast("error", error instanceof Error ? error.message : "Error al registrar compra");
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
    submitPurchase
  };
};

