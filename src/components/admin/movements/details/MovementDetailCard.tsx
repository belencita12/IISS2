import { Card } from "@/components/ui/card";
import Image from "next/image";
import  MovementDetails  from "@/lib/movements/IMovementDetails";
import { useTranslations } from "next-intl";

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
  const p = useTranslations("ProductDetail")

  return (
    <Card className="flex p-4 items-start gap-4 shadow-sm border">
      <Image
        src={detail.product.image?.originalUrl || "/NotImageNicoPets.png"}
        alt={detail.product.name}
        width={80}
        height={80}
        className="object-contain rounded-md border"
      />
      <div className="flex-1">
        <h3 className="font-medium text-lg">{detail.product.name}</h3>
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-700">
          <DetailItem label={p("category")} value={detail.product.category} />
          <DetailItem label={p("code")} value={`${detail.product.code}`} />
          <DetailItem label={p("tags")} value={`${detail.product.tags}`} />
          <DetailItem
            label={p("price")}
            value={`${detail.product.price?.toLocaleString()} Gs.`}
          />
          <DetailItem
            label={p("cost")}
            value={`${detail.product.cost?.toLocaleString()} Gs.`}
          />
          <DetailItem label={p("quantity")} value={`${detail.quantity}`} />
        </div>
      </div>
    </Card>
  );
};
