"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import ServiceTypeForm from "./ServiceTypeForm";
import { ServiceType } from "@/hooks/service-types/useServiceTypeList";

interface ServiceTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSuccess: () => void;
  defaultValues?: ServiceType;
}

export function ServiceTypeFormModal({
  isOpen,
  onClose,
  token,
  onSuccess,
  defaultValues,
}: ServiceTypeFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <ServiceTypeForm
          token={token}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
         // defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
} 