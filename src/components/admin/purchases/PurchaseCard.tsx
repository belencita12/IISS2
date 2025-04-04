// components/PurchaseCard.tsx
import { PurchaseData } from "@/lib/purchase/IPurchase";

interface PurchaseCardProps {
  purchase: PurchaseData;
}

const PurchaseCard = ({ purchase }: PurchaseCardProps) => {
  return (
    <div className="border p-4 rounded-lg flex justify-between items-center bg-white shadow hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-bold text-lg">{purchase.provider?.businessName}</h3>
        <p>Costo Total: {purchase.total.toLocaleString()} Gs.</p>
        <p>Costo IVA Total: {purchase.ivaTotal.toLocaleString()} Gs.</p>
        {/* Si tenés el conteo de ítems, podés mostrarlo aquí también */}
      </div>
      <p className="text-gray-500">{new Date(purchase.date || "").toLocaleDateString()}</p>
    </div>
  );
};

export default PurchaseCard;
