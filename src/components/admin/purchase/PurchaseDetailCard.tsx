import Image from "next/image";
import { Card } from "@/components/ui/card";
import { PurchaseDetail } from "@/lib/purchase/IPurchaseDetail";

interface PurchaseDetailCardProps {
  detail: PurchaseDetail;
}

const PurchaseDetailCard: React.FC<PurchaseDetailCardProps> = ({ detail }) => {
  return (
    <Card className="p-4 mb-4">
      <div className="flex gap-4">
        {detail.product.image?.originalUrl && (
          <Image
            src={detail.product.image.originalUrl}
            alt={detail.product.name}
            width={100}
            height={100}
            className="rounded object-cover"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold">{detail.product.name}</h3>
          <p>Código: {detail.product.code}</p>
          <p>Categoría: {detail.product.category}</p>
          <p>Precio: {detail.product.price.toLocaleString()} Gs</p>
          <p>Cantidad: {detail.quantity}</p>
          <p>Total: {detail.partialAmount.toLocaleString()} Gs</p>
        </div>
      </div>
    </Card>
  );
};

export default PurchaseDetailCard;