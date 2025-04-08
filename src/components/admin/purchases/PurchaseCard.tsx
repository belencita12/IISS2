"use client";

import { PurchaseData } from "@/lib/purchase/IPurchase";
import { useRouter } from "next/navigation";

interface PurchaseCardProps {
  purchase: PurchaseData;
}

const PurchaseCard = ({ purchase }: PurchaseCardProps) => {
  const router = useRouter();

  const handleViewDetail = () => {
    if (purchase.id) {
      router.push(`/dashboard/purchases/${purchase.id}`);
    }
  };

  return (
    <div
      onClick={handleViewDetail}
      className="cursor-pointer border p-4 rounded-lg flex justify-between items-start bg-white shadow hover:-translate-y-1 transition-transform duration-300 hover:shadow-md"
    >
      <div>
        <h3 className="font-bold text-lg">{purchase.provider?.businessName}</h3>
        <p>Costo Total: {purchase.total.toLocaleString()} Gs.</p>
        <p>Costo IVA Total: {purchase.ivaTotal.toLocaleString()} Gs.</p>
        <p>Depósito: {purchase.stock?.name}</p>
      </div>

      <div className="flex flex-col justify-between items-end h-full">
        <p className="text-black text-lg font-bold">{purchase.date}</p>
      </div>
    </div>
  );
};

export default PurchaseCard;
