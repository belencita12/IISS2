"use client";

import React, { useState } from "react";
import { EyeIcon, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ConfirmationModal } from "../global/Confirmation-modal";
import { useTranslations } from "next-intl";

interface DepositCardProps {
  nombre: string;
  ubicacion: string;
  id?: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const DepositCard: React.FC<DepositCardProps> = ({
  nombre,
  ubicacion,
  id,
  onEdit,
  onDelete,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const s = useTranslations("StockList");
  const b = useTranslations("Button");
  const m = useTranslations("ModalConfirmation");

  const handleDelete = () => {
    if (!id || !onDelete) return;
    onDelete(id);
  };

  const onClose = () => setIsConfirmOpen(false);

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center hover:-translate-y-1 transition-transform duration-300 hover:shadow-md">
        <div>
          <p className="text-lg font-bold">{nombre}</p>
          <p className="text-sm text-gray-600">{s("address")}: {ubicacion}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/stock/${id}`} passHref>
            <Button variant="outline" size="icon" title="Ver detalles">
              <EyeIcon className="w-5 h-5 text-gray-700" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="icon"
            title={b("edit")}
            onClick={() => id && onEdit?.(id)}
          >
            <Pencil className="w-5 h-5 text-gray-700" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            title={b("delete")}
            onClick={() => setIsConfirmOpen(true)}
          >
            <Trash className="w-5 h-5 text-black" />
          </Button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title={m("titleDelete", {field: "depósito"})}
        message={m("deleteMessage", {field: nombre})}
        confirmText={b("delete")}
        cancelText={b("cancel")}
        variant="danger"
      />
    </>
  );
};

export default DepositCard;
