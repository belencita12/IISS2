import { Button } from "@/components/ui/button";
import { PurchaseData } from "@/lib/purchase/IPurchase";
import { Eye } from "lucide-react";
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
    <div className="border p-4 rounded-lg flex justify-between items-center bg-white shadow hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-bold text-lg">{purchase.provider?.businessName}</h3>
        <p>Costo Total: {purchase.total.toLocaleString()} Gs.</p>
        <p>Costo IVA Total: {purchase.ivaTotal.toLocaleString()} Gs.</p>
        <p>Deposito: {purchase.stock?.name}</p>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-gray-500">{new Date(purchase.date || "").toLocaleDateString()}</p>
          <Button
            className="bg-transparent hover:bg-gray-100"
            onClick={handleViewDetail}
            title="Ver detalles"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </Button>
      </div>
    </div>
  );
};

export default PurchaseCard;
