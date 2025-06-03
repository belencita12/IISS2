import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/global/Modal";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/global/FormInput";
import { toast } from "@/lib/toast";
import { useFetch } from "@/hooks/api";
import { INVOICE_API } from "@/lib/urls";
import PaymentMethods from "@/components/admin/sales/PaymentMethods";
import { Invoice, PaymentFormData } from "@/lib/invoices/IInvoice";

type PaymentFormProps = {
  init?: Invoice;
  token: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function PaymentForm({ init, isOpen, token, onClose }: PaymentFormProps) {
  const paymentSchema = z.object({
    paymentDate: z.string().min(1, "La fecha es obligatoria"),
  });

  type PaymentFormType = z.infer<typeof paymentSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm<PaymentFormType>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentDate: new Date().toISOString().split("T")[0],
    },
  });
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PY").format(amount);
  };

  const [paymentMethods, setPaymentMethods] = useState<
    { method: string; amount: number }[]
  >([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const { post, loading } = useFetch<Invoice, PaymentFormData>(
    `${INVOICE_API}/pay/${init?.id}`,
    token,
    { method: "POST" }
  );

  useEffect(() => {
    if (init) {
      const remaining = init.total - init.totalPayed;
      const today = new Date().toISOString().split("T")[0];
      setTotalAmount(remaining);
      setRemainingAmount(remaining);
      setValue("paymentDate", today);
    }
  }, [init, isOpen, setValue]);

  useEffect(() => {
    const sum = paymentMethods.reduce((acc, p) => acc + p.amount, 0);
    setRemainingAmount(totalAmount - sum);
  }, [paymentMethods, totalAmount]);

  if (!isOpen) return null;

  const totalEntered = paymentMethods.reduce((sum, p) => sum + p.amount, 0);
  const exceedsTotal = totalEntered > totalAmount;

  const onSubmit = async (data: PaymentFormType) => {
    if (paymentMethods.length === 0) {
      toast("error", "Debe seleccionar al menos un método de pago");
      return;
    }
    if (totalEntered <= 0) {
      toast("error", "Debe ingresar un monto mayor a 0");
      return;
    }
    if (exceedsTotal) {
      toast(
        "error",
        "La suma de los métodos de pago no puede exceder el saldo pendiente"
      );
      return;
    }

    const paymentData: PaymentFormData = {
      amount: totalEntered,
      paymentDate: data.paymentDate,
      paymentMethods: paymentMethods.map((p) => ({
        methodId: Number(p.method),
        amount: p.amount,
      })),
    };

    try {
      const response = await post(paymentData);
      if (response.ok && response.data) {
        toast("success", "Pago registrado con éxito");
        reset();
        setPaymentMethods([]);
        onClose();
      } else {
        toast("error", "Error al registrar el pago");
      }
    } catch (error) {
      toast("error", "Error al registrar el pago");
    }
  };

  return (
    <Modal
      title="Registrar Pago"
      isOpen={isOpen || loading}
      onClose={onClose}
      size="sm"
    >
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Monto pendiente
          </p>
          <p className="text-sm font-bold text-gray-600 p-2">
            {formatCurrency(totalAmount)} Gs.
          </p>
        </div>
        <div className="w-1/2">
          <FormInput
            register={register("paymentDate")}
            error={errors.paymentDate?.message}
            label="Fecha de Pago"
            name="paymentDate"
            type="date"
          />
        </div>
      </div>
      {/* Métodos de pago */}
      <PaymentMethods
        token={token}
        onPaymentMethodsChange={setPaymentMethods}
        onSelectedMethodChange={setSelectedMethod}
        selectedMethod={selectedMethod}
        thereIsProducts={true}
      />

      {/* Monto total a pagar */}
      <div className="p-4">
        <div className="flex justify-end items-center gap-2">
          <p className="text-md font-medium text-muted-foreground">
            Monto a pagar:
          </p>
          <p
            className={`text-md font-semibold ${
              exceedsTotal ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formatCurrency(totalEntered)} Gs.
          </p>
        </div>
        {exceedsTotal && (
          <p className="text-sm mt-1 text-red-600 text-right">
            La cantidad a pagar no puede exceder al monto pendiente.
          </p>
        )}
      </div>
      <div className="flex justify-end items-center gap-2 pt-2">
        <Button
          disabled={loading}
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          disabled={loading || exceedsTotal}
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </div>
    </Modal>
  );
};
