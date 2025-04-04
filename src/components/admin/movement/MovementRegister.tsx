"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { registerMovement } from "@/lib/movement/registerMovement";
import { getStocks } from "@/lib/stock/getStock";
import { StockData } from "@/lib/stock/IStock";
import { MovementProductItem } from "@/lib/movement/IMovement";
import { Button } from "@/components/ui/button";
import MovementData from "@/components/admin/movement/MovementData";
import MovementDetailsControl from "@/components/admin/movement/MovementDetailsControl";

// Schema y tipo del formularios
const movementFormSchema = z.object({
  managerId: z.number().min(1, "El ID del encargado es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  type: z.enum(["INBOUND", "OUTBOUND", "TRANSFER"]),
  originStockId: z.number().min(1, "El ID de origen es obligatorio"),
  destinationStockId: z.number().min(1, "El ID de destino es obligatorio"),
  dateMovement: z.string().min(1, "La fecha es obligatoria"),
});

type MovementFormValues = z.infer<typeof movementFormSchema>;

interface MovementRegisterFormProps {
  token?: string;
}

export default function MovementRegisterForm({ token }: MovementRegisterFormProps) {
  const router = useRouter();
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [productDetails, setProductDetails] = useState<MovementProductItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      managerId: 0,
      description: "",
      type: "TRANSFER",
      originStockId: 1,
      destinationStockId: 2,
      dateMovement: "",
    },
  });

  useEffect(() => {
    if (!token) return;

    const fetchStocksData = async () => {
      try {
        const result = await getStocks({ page: 1 }, token);
        setStocks(result.data);
      } catch {
        toast("error", "Error al cargar los depósitos");
      }
    };

    fetchStocksData();
  }, [token]);

  const onSubmit = async (data: MovementFormValues) => {
    if (!token) {
      toast("error", "Debes estar autenticado para registrar un movimiento");
      return;
    }

    if (productDetails.length === 0) {
      toast("error", "Debes agregar al menos un producto al movimiento");
      return;
    }

    const payload = {
      ...data,
      dateMovement: new Date(data.dateMovement).toISOString(),
      details: productDetails.map((item) => ({
        productId: parseInt(item.productId),
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);

    try {
      await registerMovement(payload, token);
      toast("success", "Movimiento registrado con éxito", {
        duration: 2000,
        onAutoClose: () => router.push("/dashboard/movements"),
        onDismiss: () => router.push("/dashboard/movements"),
      });
    } catch {
      toast("error", "Hubo un error al registrar el movimiento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-10">
      <div className="w-full max-w-[80%]">
        <form
          id="movementForm"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          {/* Formulario de datos generales */}
          <MovementData
            token={token ?? ""}
            stocks={stocks}
            register={register}
            errors={errors}
            setValue={setValue}
          />

          {/* Controlador de detalles de productos */}
          <MovementDetailsControl
            token={token ?? ""}
            productDetails={productDetails}
            setProductDetails={setProductDetails}
          />

          {/* Botones */}
          <div className="flex justify-start gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
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
    </div>
  );
}
