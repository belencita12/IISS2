import { useState } from "react";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { ExtendedPurchaseDetail } from "@/lib/purchases/IPurchaseRegister";
import { Trash, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/global/Modal";
import { useTranslations } from "next-intl";

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
  const [modalOpen, setModalOpen] = useState(false);

  const p = useTranslations("ProductDetail");
  const b = useTranslations("Button");
  const e = useTranslations("Error");
  const m = useTranslations("ModalConfirmation");

  if (details.length === 0) return null;

  const data = details.map((detail) => ({
    ...detail,
    id: detail.productId,
  }));

  const columns: Column<(typeof data)[number]>[] = [
    { header: p("code"), accessor: "code" },
    { header: p("name"), accessor: "name" },
    {
      header: p("quantity"),
      accessor: (row) => row.quantity,
    },
    {
      header: "",
      accessor: (row) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setModalOpen(true);
            setEditingId(row.productId);
            setTempQuantity(row.quantity);
          }}
          aria-label={b("edit")}
        >
          <Pencil className="w-5 h-5" />
        </Button>
      ),
      className: "p-1 text-right",
    },
    {
      header: "",
      accessor: (row) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(row.productId)}
          aria-label={b("delete")}
        >
          <Trash className="w-5 h-5" />
        </Button>
      ),
      className: "p-1 text-left",
    },
  ];

  const handleSave = () => {
    if (editingId !== null) {
      onUpdateQuantity(editingId, tempQuantity);
      setModalOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "Minus") {
      e.preventDefault();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && !isNaN(Number(value)))) {
      setTempQuantity(value === "" ? 1 : Number(value));
    }
  };

  return (
    <div className="w-full">
      <GenericTable
        data={data}
        columns={columns}
        emptyMessage={e("noSelect", {field: "producto"})}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={m("titleUpdate", {field: "cantidad"})}
        size="sm"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium">{p("quantity")}</label>
          <Input
            type="number"
            min={1}
            value={tempQuantity}
            onChange={handleQuantityChange}
            onKeyDown={handleKeyDown}
            className="mb-4"
          />
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">
              {b("cancel")}
            </Button>
            <Button onClick={handleSave} type="button">
              {b("update")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
