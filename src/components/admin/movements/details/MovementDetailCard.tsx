import { Card } from "@/components/ui/card";
import Image from "next/image";
import  MovementDetails  from "@/lib/movements/IMovementDetails";

interface Props {
  detail: MovementDetails;
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p>{value}</p>
  </div>
);

export const MovementDetailCard = ({ detail }: Props) => {
  return (
    <Card className="flex p-4 items-start gap-4 shadow-sm border">
      <Image
        src={detail.product.image?.originalUrl || "/producto-sin-imagen.png"}
        alt={detail.product.name ?? "Producto sin nombre"}
        width={80}
        height={80}
        className="object-contain rounded-md border"
      />
      <div className="flex-1">
        <h3 className="font-medium text-lg">{detail.product.name}</h3>
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-700">
          <DetailItem label="Categoría" value={detail.product.category} />
          <DetailItem label="Código" value={`${detail.product.code}`} />
          <DetailItem label="Tags" value={`${detail.product.tags}`} />
          <DetailItem
            label="Precio Unitario"
            value={`${detail.product.price?.toLocaleString()} Gs.`}
          />
          <DetailItem
            label="Precio Compra"
            value={`${detail.product.cost?.toLocaleString()} Gs.`}
          />
          <DetailItem label="Cantidad" value={`${detail.quantity}`} />
        </div>
      </div>
    </Card>
  );
};
