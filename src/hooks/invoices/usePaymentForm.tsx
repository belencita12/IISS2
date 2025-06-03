import { useState } from "react";
import { Invoice } from "@/lib/invoices/IInvoice";

export const usePaymentForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();

  const onOpen = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };

  const onClose = () => {
    setSelectedInvoice(undefined);
    setIsFormOpen(false);
  };

  return {
    isFormOpen,
    selectedInvoice,
    setSelectedInvoice,
    onOpen,
    onClose,
  };
};
