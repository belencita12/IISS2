"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/global/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { Stamped } from "@/lib/stamped/IStamped";
import { useTranslations } from "next-intl";
import { useStockList } from "@/hooks/stamped/useStockList";
import NumericInput from "@/components/global/NumericInput";
import { StockData } from "@/lib/stock/IStock";

interface StampedFormProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSuccess: () => void;
  defaultValues?: Stamped | null;
}

export function StampedForm({
  isOpen,
  onClose,
  token,
  onSuccess,
  defaultValues,
}: StampedFormProps) {
  const t = useTranslations("Stamped");
  const ph = useTranslations("Placeholder");
  const { stocks, isLoading: isLoadingStocks, error } = useStockList(token, defaultValues?.stock?.id);
  const [minDate, setMinDate] = useState("");
  const [activeStampedNumbers, setActiveStampedNumbers] = useState<string[]>([]);
  const [isLoadingActiveNumbers, setIsLoadingActiveNumbers] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today.toISOString().split('T')[0]);

    // Obtener números de timbrado activos
    const fetchActiveStampedNumbers = async () => {
      if (defaultValues) return; // No necesitamos verificar si estamos editando
      
      setIsLoadingActiveNumbers(true);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://iiss2-be.duckdns.org';
        const response = await fetch(`${API_BASE_URL}/stamped?page=1&size=10&includeDeleted=false`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Error al obtener los timbrados activos");
        }

        const data = await response.json();
        const activeNumbers = data.data
          .filter((stamped: Stamped) => stamped.isActive)
          .map((stamped: Stamped) => stamped.stampedNum);
        
        setActiveStampedNumbers(activeNumbers);
      } catch (error) {
        console.error("Error al obtener timbrados activos:", error);
      } finally {
        setIsLoadingActiveNumbers(false);
      }
    };

    if (isOpen) {
      fetchActiveStampedNumbers();
    }
  }, [isOpen, token, defaultValues]);

  const stampedSchema = z.object({
    stampedNum: z.string()
      .min(1, "El número de timbrado es obligatorio")
      .refine(
        (num) => /^\d{8}$/.test(num),
        "El número de timbrado debe tener exactamente 8 dígitos"
      )
      .refine(
        (num) => {
          if (!num || isLoadingActiveNumbers) return true;
          return !activeStampedNumbers.includes(num);
        },
        "Este número de timbrado ya está activo"
      ),
    stockId: z.number().min(1, "El depósito es obligatorio"),
    fromDate: z.string()
      .min(1, "La fecha desde es obligatoria")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        //selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }, "La fecha de inicio debe ser desde el siguiente día en adelante"),
    toDate: z.string()
      .min(1, "La fecha hasta es obligatoria"),
    fromNum: z.coerce
      .number()
      .refine((val) => !isNaN(val), "El número inicial debe ser un número válido")
      .refine((val) => val >= 1, "El número inicial debe ser mayor o igual a 1"),
    toNum: z.coerce
      .number()
      .refine((val) => !isNaN(val), "El número final debe ser un número válido")
      .refine((val) => val >= 1, "El número final debe ser mayor o igual a 1")
      .refine((val) => val <= 2001, "El número final no puede ser mayor a 2001"),
  }).refine((data) => data.fromNum <= data.toNum, {
    message: "El número final no puede ser menor que el número inicial",
    path: ["toNum"],
  }).refine((data) => {
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    
    // Obtener el último día del mes siguiente del año siguiente
    const maxDate = new Date(fromDate);
    maxDate.setFullYear(fromDate.getFullYear() + 1);
    maxDate.setMonth(fromDate.getMonth() + 1); // Mes siguiente
    maxDate.setDate(0); // Último día del mes
    
    return toDate <= maxDate;
  }, {
    message: "La fecha final debe ser hasta el último día del mes siguiente del año siguiente",
    path: ["toDate"],
  });

  type StampedFormData = z.infer<typeof stampedSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<StampedFormData>({
    resolver: zodResolver(stampedSchema),
    defaultValues: {
      stampedNum: defaultValues?.stampedNum || "",
      stockId: defaultValues?.stock?.id || 0,
      fromDate: defaultValues?.fromDate ? new Date(defaultValues.fromDate).toISOString().split('T')[0] : "",
      toDate: defaultValues?.toDate ? new Date(defaultValues.toDate).toISOString().split('T')[0] : "",
      fromNum: defaultValues?.fromNum || 0,
      toNum: defaultValues?.toNum || 0,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        stampedNum: defaultValues.stampedNum,
        stockId: defaultValues.stock?.id || 0,
        fromDate: new Date(defaultValues.fromDate).toISOString().split('T')[0],
        toDate: new Date(defaultValues.toDate).toISOString().split('T')[0],
        fromNum: defaultValues.fromNum,
        toNum: defaultValues.toNum,
      });
    } else {
      reset({
        stampedNum: "",
        stockId: 0,
        fromDate: minDate,
        toDate: "",
        fromNum: 0,
        toNum: 0,
      });
    }
  }, [defaultValues, reset, minDate]);

  const onSubmit = async (data: StampedFormData) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://iiss2-be.duckdns.org';
      const url = defaultValues?.id
        ? `${API_BASE_URL}/stamped/${defaultValues.id}`
        : `${API_BASE_URL}/stamped`;
      const method = defaultValues?.id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stampedNum: data.stampedNum,
          stockId: data.stockId,
          fromDate: data.fromDate,
          toDate: data.toDate,
          fromNum: data.fromNum,
          toNum: data.toNum
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el timbrado");
      }

      toast(
        "success",
        defaultValues?.id
          ? "Timbrado actualizado correctamente"
          : "Timbrado creado correctamente"
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error completo:', error);
      toast(
        "error",
        error instanceof Error
          ? "Error al procesar la solicitud. Por favor, intente nuevamente."
          : "Error de conexión con el servidor. Por favor, intente nuevamente."
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultValues ? "Editar Timbrado" : "Registrar Timbrado"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1 py-2" noValidate>
        <div>
          <Label htmlFor="stampedNum">Número de Timbrado</Label>
          <Input
            id="stampedNum"
            {...register("stampedNum")}
            placeholder="Ingrese el número de timbrado (8 dígitos)"
            maxLength={8}
            pattern="[0-9]*"
            inputMode="numeric"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                e.preventDefault();
              }
            }}
            disabled={isSubmitting || isLoadingActiveNumbers}
          />
          {errors.stampedNum && (
            <p className="text-sm text-red-600 mt-1">{errors.stampedNum.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="stockId">Depósito</Label>
          <select
            id="stockId"
            {...register("stockId", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
            disabled={isLoadingStocks || isSubmitting}
          >
            <option value="">Seleccione un depósito</option>
            {stocks.map((stock: StockData) => (
              <option key={stock.id} value={stock.id}>
                {stock.name} - {stock.address}
              </option>
            ))}
          </select>
          {isLoadingStocks && (
            <p className="text-sm text-gray-500 mt-1">Cargando depósitos...</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-1">Error al cargar los depósitos</p>
          )}
          {!isLoadingStocks && stocks.length === 0 && (
            <p className="text-sm text-yellow-600 mt-1">No hay depósitos disponibles</p>
          )}
          {errors.stockId && (
            <p className="text-sm text-red-600 mt-1">{errors.stockId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fromDate">Fecha Desde</Label>
            <Input
              id="fromDate"
              type="date"
              min={minDate}
              {...register("fromDate")}
              disabled={isSubmitting}
            />
            {errors.fromDate && (
              <p className="text-sm text-red-600 mt-1">{errors.fromDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="toDate">Fecha Hasta</Label>
            <Input
              id="toDate"
              type="date"
              {...register("toDate")}
              disabled={isSubmitting}
            />
            {errors.toDate && (
              <p className="text-sm text-red-600 mt-1">{errors.toDate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fromNum">Número Inicial</Label>
            <NumericInput
              id="fromNum"
              type="number"
              placeholder="Ingrese el número inicial"
              value={watch("fromNum") ?? ""}
              onChange={(e) => setValue("fromNum", Number(e.target.value), { shouldValidate: true })}
              error={errors.fromNum?.message}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="toNum">Número Final</Label>
            <NumericInput
              id="toNum"
              type="number"
              placeholder="Ingrese el número final"
              value={watch("toNum") ?? ""}
              onChange={(e) => setValue("toNum", Number(e.target.value), { shouldValidate: true })}
              error={errors.toNum?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting || isLoadingStocks || isLoadingActiveNumbers}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isLoadingStocks || isLoadingActiveNumbers}
          >
            {isSubmitting 
              ? defaultValues 
                ? "Actualizando..." 
                : "Registrando..."
              : defaultValues 
                ? "Actualizar" 
                : "Registrar"
            }
          </Button>
        </div>
      </form>
    </Modal>
  );
} 