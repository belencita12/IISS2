
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PaymentFormData, Invoice } from "@/lib/invoices/IInvoice";
import { useFetch } from "@/hooks/api";
import { INVOICE_API } from "@/lib/urls";
import { toast } from "@/lib/toast";

const paymentSchema = z.object({
  paymentDate: z.string().min(1, "La fecha es obligatoria"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
});

type PaymentFormType = z.infer<typeof paymentSchema>;

export const useCreatePayment = (invoice?: Invoice, token?: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PaymentFormType>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentDate: new Date().toISOString().split("T")[0],
      amount: 0,
    },
  });

  const [paymentMethods, setPaymentMethods] = useState<
    { method: string; amount: number }[]
  >([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const { post, loading } = useFetch<Invoice, PaymentFormData>(
    `${INVOICE_API}/pay/${invoice?.id}`,
    token || "",
    { method: "POST" }
  );

  useEffect(() => {
    if (invoice) {
      const remaining = invoice.total - invoice.totalPayed;
      const today = new Date().toISOString().split("T")[0];
      setTotalAmount(remaining);
      setRemainingAmount(remaining);
      setValue("paymentDate", today);
      setValue("amount", 0);
    }
  }, [invoice, setValue]);

 useEffect(() => {
  const sum = paymentMethods.reduce((acc, p) => acc + p.amount, 0);
  const newRemaining = totalAmount - sum;
  setRemainingAmount(newRemaining > 0 ? newRemaining : 0);
  setValue("amount", sum, { shouldValidate: true });
}, [paymentMethods, totalAmount, setValue]);


  const amount = watch("amount");
  const exceedsTotal = amount > totalAmount;

  const onSubmit = async (data: PaymentFormType) => {
    if (paymentMethods.length === 0) {
      toast("error", "Debe seleccionar al menos un método de pago");
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
      amount: data.amount,
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
        window.location.reload(); 
        return true;
      } else {
        toast("error", "Error al registrar el pago");
      }
    } catch {
      toast("error", "Error al registrar el pago");
    }

    return false;
  };

  return {
    register,
    handleSubmit,
    errors,
    amount,
    exceedsTotal,
    loading,
    paymentMethods,
    setPaymentMethods,
    selectedMethod,
    setSelectedMethod,
    remainingAmount,
    onSubmit,
    totalAmount,
    reset,
  };
};
