import { Modal } from "@/components/admin/invoices/invoicePayment/ModalInvoice";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/global/FormInput";
import PaymentMethods from "./InvoicePaymentMethods";
import { Invoice } from "@/lib/invoices/IInvoice";
import { useCreatePayment } from "@/hooks/invoices/useRegisterInvoicePay";

type PaymentFormProps = {
  init?: Invoice;
  token: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function PaymentForm({
  init,
  isOpen,
  token,
  onClose,
}: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    amount,
    exceedsTotal,
    loading,
    setPaymentMethods,
    selectedMethod,
    setSelectedMethod,
    remainingAmount,
    onSubmit,
    reset,
    totalAmount,
  } = useCreatePayment(init, token);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PY").format(amount);
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Registrar Pago"
      isOpen={isOpen || loading}
      onClose={onClose}
      size="lg"
    >
      <div className="p-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-md font-medium text-muted-foreground ml-6">
              Monto pendiente
            </p>
            <p className="text-sm font-bold text-gray-600 ml-6">
              {formatCurrency(remainingAmount)} Gs.
            </p>
          </div>
          <div className="w-1/2">
            <FormInput
              register={register("paymentDate")}
              error={errors.paymentDate?.message}
              label="Fecha de Pago"
              name="paymentDate"
              type="date"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <PaymentMethods
          token={token}
          onPaymentMethodsChange={setPaymentMethods}
          onSelectedMethodChange={setSelectedMethod}
          selectedMethod={selectedMethod}
        />

        <div className="flex justify-start items-center gap-2 ml-8 mt-4">
          <p className="text-md font-medium text-muted-foreground">
            Monto a pagar:
          </p>
          <p className="text-md font-semibold text-gray-900">
            {formatCurrency(amount)} Gs.
          </p>
        </div>

        {exceedsTotal && (
          <p className="text-sm text-red-600 ml-8 mt-1">
            Excede en {formatCurrency(amount - totalAmount)} Gs.
          </p>
        )}

        <div className="flex justify-end items-center gap-2 p-2">
          <Button
            disabled={loading}
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button
            disabled={loading || exceedsTotal || amount === 0}
            type="button"
            onClick={handleSubmit(async (data) => {
              const success = await onSubmit(data);
              if (success) onClose();
            })}
          >
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
