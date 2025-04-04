"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { PurchaseDetail } from "@/lib/purchases/IPurchase";

type ProductListProps = {
  details: PurchaseDetail[];
  onRemove: (productId: number) => void;
};

export default function ProductList({ details, onRemove }: ProductListProps) {
  if (details.length === 0) return null;

  return (
    <div className="border rounded-md p-4 mb-4">
      <ul>
        {details.map((product) => (
          <li
            key={product.productId}
            className="flex justify-between items-center"
          >
            <span>
              {`Producto ${product.productId}`} - Cantidad: {product.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onRemove(product.productId)}
            >
              <Trash className="w-5 h-5" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
