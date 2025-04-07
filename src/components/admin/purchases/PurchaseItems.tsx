"use client";

import { useState } from "react";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import { ExtendedPurchaseDetail } from "@/lib/purchases/IPurchase";
import { Trash, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";

type ProductListProps = {
  details: ExtendedPurchaseDetail[];
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  
};

export default function ProductList({
  details,
  onRemove,
  onUpdateQuantity,
}: ProductListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(1);
  const [previousQuantity, setPreviousQuantity] = useState<number | null>(null);

  if (details.length === 0) return null;

  const data = details.map((detail) => ({
    ...detail,
    id: detail.productId,
  }));
  const columns: Column<(typeof data)[number]>[] = [
    { header: "Código", accessor: "code" },
    { header: "Nombre", accessor: "name" },
    {
      header: "Cantidad",
      accessor: (row) =>
        editingId === row.productId ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              className="w-20"
              min={1}
              value={tempQuantity}
              onChange={(e) => setTempQuantity(Number(e.target.value))}
              onBlur={() => {
                if (tempQuantity !== previousQuantity) {
                  onUpdateQuantity(row.productId, tempQuantity);
                }
                setPreviousQuantity(tempQuantity);
                setEditingId(null);
              }}
            />
          </div>
        ) : (
          row.quantity
        ),
    },
  ];
  const actions: TableAction<(typeof data)[number]>[] = [
    {
      icon: <Pencil className="w-5 h-5" />,
      label: "Editar",
      onClick: (item) => {
        setEditingId(item.productId);
        setTempQuantity(item.quantity);
        setPreviousQuantity(item.quantity);
      },
    },
    {
      icon: <Trash className="w-5 h-5" />,
      label: "Eliminar",
      onClick: (item) => onRemove(item.productId),
    },
  ];
  return (
    <div className="w-full">
      <GenericTable
        data={data}
        columns={columns}
        actions={actions}
        actionsTitle=""
        emptyMessage="No hay productos seleccionados"
      />
    </div>
  );
}
