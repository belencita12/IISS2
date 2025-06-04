"use client";

import { Modal } from "./Modal";
import PrintButton from "./PrintButton";
import { Button } from "../ui/button";

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => Promise<void>;
  isPrinting: boolean;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  isPrinting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recibo generado">
      <p className="text-sm text-muted-foreground mb-4">
        ¿Deseas imprimir el recibo ahora?
      </p>
      <div className="flex gap-4">
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full"
          disabled={isPrinting}
        >
          Cancelar
        </Button>
        <PrintButton onClick={onPrint} isLoading={isPrinting} />
      </div>
    </Modal>
  );
};
