"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { registerMovement } from "@/lib/movement/registerMovement";
import { MovementDetail, MovementType } from "@/lib/movement/IMovement";
import SearchBar from "@/components/global/SearchBar";
import { fetchEmployees } from "@/lib/employee/getEmployees";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { getStocks } from "@/lib/stock/getStock";
import { StockData } from "@/lib/stock/IStock";
import { getProductById } from "@/lib/admin/products/getProductById";
import {MovementProductItem} from "@/lib/movement/IMovement"

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [productIdInput, setProductIdInput] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productDetails, setProductDetails] = useState<MovementProductItem[]>([]);

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

  const handleAddProduct = async () => {
    const id = productIdInput.trim();
    if (!id || isNaN(Number(id))) {
      toast("info", "Ingresá un ID numérico válido");
      return;
    }
  
    try {
      const product = await getProductById(id, token  ?? "");
  
      if (productDetails.some((p) => p.productId === product.id)) {
        toast("info", "El producto ya fue agregado");
        return;
      }
  
      const item: MovementProductItem = {
        productId: product.id,
        code: product.code,
        name: product.name,
        quantity,
      };
  
      setProductDetails([...productDetails, item]);
      setProductIdInput("");
      setQuantity(1);
    } catch {
      toast("error", "Producto no encontrado");
    }
  };
  

  const onSubmit = async (data: MovementFormValues) => {
    if (!token) {
      toast("error", "Debes estar autenticado para registrar un movimiento");
      return;
    }

    const details = productDetails.map((p) => ({
      productId: parseInt(p.productId), // si `productId` es string
      quantity: p.quantity,
    }));

    const payload = {
      ...data,
      dateMovement: new Date(data.dateMovement).toISOString(),
      details,
    };

    setIsSubmitting(true);

    try {
      await registerMovement(payload, token);
      toast("success", "Movimiento registrado con éxito", {
        duration: 2000,
        onAutoClose: () => {
          router.push("/dashboard/movements");
        },
        onDismiss: () => router.push("/dashboard/movements"),
      });
    } catch {
      toast("error", "Hubo un error al registrar el movimiento");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchStocks = async () => {
      if (!token) return;
      try {
        const result = await getStocks({ page: 1}, token);
        setStocks(result.data);
      } catch (error) {
        toast("error", "Error al cargar depositos");
      }
    }
    fetchStocks();
  }, [token]);

  return (
    <div className="flex justify-center p-10">
      <div className="w-full max-w-[80%]">
        <form
          id="movementForm"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="w-full flex flex-col gap-2">
          {/* Contenedor responsivo en 2 columnas que colapsan en móviles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {/* Encargado */}
            <div className="w-full">
              <Label>Encargado</Label>
              <SearchBar
                placeholder="Buscar encargado..."
                manualSearch
                onSearch={async (query) => {
                  try {
                    const result = await fetchEmployees(1, query, token ?? null);
                    const empleados: EmployeeData[] = result.data;

                    const match = empleados.find(
                      (emp) => emp.fullName.toLowerCase() === query.trim().toLowerCase()
                    );

                    if (match?.id !== undefined) {
                      setValue("managerId", match.id);
                      toast("success", `Encargado seleccionado: ${match.fullName}`);
                      console.log("Id de Empleado :" + match.id);
                    } else {
                      toast("error", "Empleado no encontrado o ID Invalido");
                    }
                  } catch (error) {
                    toast("error", "Error al buscar empleados");
                  }
                }}
              />
            </div>

            {/* Tipo, Origen y Destino (agrupados horizontalmente) */}
            <div className="flex gap-4 w-full">
              {/* Tipo */}
              <div className="flex-1">
                <Label>Tipo de Movimiento</Label>
                <select
                  {...register("type")}
                  className="w-full border rounded p-2"
                >
                  <option value="TRANSFER">Transferencia</option>
                  <option value="INBOUND">Entrada</option>
                  <option value="OUTBOUND">Salida</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>

              {/* Origen */}
              <div className="flex-1">
                <Label>Stock Origen (ID)</Label>
                <select
                {...register("originStockId", { valueAsNumber: true })}
                className="w-full border rounded p-2"
              >
                <option value="">Seleccione depósito</option>
                {stocks.map((stock) => (
                  <option key={stock.id} value={stock.id}>
                    {stock.name}
                  </option>
                ))}
              </select>
                {errors.originStockId && (
                  <p className="text-red-500 text-sm">{errors.originStockId.message}</p>
                )}
              </div>

              {/* Destino */}
              <div className="flex-1">
                <Label>Stock Destino (ID)</Label>
                <select
                  {...register("destinationStockId", { valueAsNumber: true })}
                  className="w-full border rounded p-2"
                >
                  <option value="">Seleccione depósito</option>
                  {stocks.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.name}
                    </option>
                  ))}
                </select>
                {errors.destinationStockId && (
                  <p className="text-red-500 text-sm">{errors.destinationStockId.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>




          {/* Descripción */}
          <div className="w-full">
            <Label>Descripción</Label>
            <textarea
              {...register("description")}
              className="w-full border rounded p-2"
              placeholder="Ingrese la descripción del movimiento"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Fecha */}
          <div className="w-full">
            <Label>Fecha del movimiento</Label>
            <Input
              type="date"
              {...register("dateMovement")}
            />
            {errors.dateMovement && (
              <p className="text-red-500">{errors.dateMovement.message}</p>
            )}
          </div>

          {/* Productos */}
          <div className="w-full mt-4">
            <Label>Productos</Label>
            <table className="w-full border text-left text-sm mt-2">
              <thead>
                <tr>
                  <th className="border px-2">#</th>
                  <th className="border px-2">ID Producto</th>
                  <th className="border px-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {productDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-2">{index + 1}</td>
                    <td className="border px-2">{item.productId}</td>
                    <td className="border px-2">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
