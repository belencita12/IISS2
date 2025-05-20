"use client";

import { Modal } from "./Modal";
import PrintButton from "./PrintButton";
import { Button } from "../ui/button";

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => Promise<void>;
  isPrinting: boolean;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  isPrinting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Factura generada">
      <p className="text-sm text-muted-foreground mb-4">
        ¿Deseas imprimir la factura ahora?
      </p>
      <div className="flex gap-4">
        <Button onClick={onClose} variant="outline" className="w-full">
          Cancelar
        </Button>
        <PrintButton onClick={onPrint} isLoading={isPrinting} />
      </div>
    </Modal>
  );
};
