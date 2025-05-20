"use client";

import { PurchaseData } from "@/lib/purchases/IPurchase";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PurchaseCardProps {
  purchase: PurchaseData;
}

const PurchaseCard = ({ purchase }: PurchaseCardProps) => {
  const router = useRouter();

  const p = useTranslations("PurchaseDetail");

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
        <p>{p("totalCost")}: {purchase.total.toLocaleString()} Gs.</p>
        <p>{p("totalCostIva")}: {purchase.ivaTotal.toLocaleString()} Gs.</p>
        <p>{p("stock")}: {purchase.stock?.name}</p>
      </div>

      <div className="flex flex-col justify-between items-end h-full">
        <p className="text-black text-lg font-bold">{purchase.date? formatDate(purchase.date):""}</p>
      </div>
    </div>
  );
};

export default PurchaseCard;
