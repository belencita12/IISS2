import { Modal } from "@/components/admin/invoices/invoicePayment/ModalInvoice";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/global/FormInput";
import PaymentMethods from "./InvoicePaymentMethods";
import { Invoice } from "@/lib/invoices/IInvoice";
import { useCreatePayment } from "@/hooks/invoices/useRegisterInvoicePay";
import { toast } from "@/lib/toast";
import { getReceiptDetailPdf } from "@/lib/receipts/getReceiptDetailPdf";
import { PrintModal } from "@/components/global/PrintModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getReceiptByInvoiceNumber } from "@/lib/receipts/getReceiptByInvoiceNumber";

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
  const router = useRouter();
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [createdReceiptId, setCreatedReceiptId] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
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

  const handlePrintReceipt = async () => {
    if (!createdReceiptId) return;
    setIsPrinting(true);

    try {
      const result = await getReceiptDetailPdf(createdReceiptId, token);

      if (
        typeof result !== "object" ||
        result === null ||
        "message" in result
      ) {
        throw new Error("No se pudo obtener el PDF del recibo.");
      }

      const blobUrl = URL.createObjectURL(result as Blob);
      const printWindow = window.open(blobUrl, "_blank");

      if (printWindow) {
        printWindow.focus();

        printWindow.onload = () => {
          printWindow.print();

          setShowPrintModal(false);
          onClose();
          URL.revokeObjectURL(blobUrl);
          window.location.reload();
        };
      } else {
        toast("error", "No se pudo abrir la ventana de impresión.");
      }
    } catch (err) {
      toast("error", (err as Error).message || "Error al imprimir el recibo");
    } finally {
      setIsPrinting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
                const result = await onSubmit(data);
                if (!result) return;

                const receipt = await getReceiptByInvoiceNumber(
                  init?.invoiceNumber ?? "",
                  token
                );
                if (receipt) {
                  setCreatedReceiptId(receipt.id);
                  setShowPrintModal(true);
                }
                router.refresh();
              })}
            >
              {loading ? "Registrando..." : "Registrar"}
            </Button>
          </div>
        </div>
      </Modal>
      <PrintModal
        isOpen={showPrintModal}
        onClose={() => {
          setShowPrintModal(false);
          onClose();
          window.location.reload();
        }}
        onPrint={handlePrintReceipt}
        isPrinting={isPrinting}
      />
    </>
  );
}
