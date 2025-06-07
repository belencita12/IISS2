import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";


// Props que el componente recibirá
type InvoiceInfoProps = {
  saleCondition: "CASH" | "CREDIT";
  setSaleCondition: (value: "CASH" | "CREDIT") => void;
};

export default function InvoiceInfo({
  saleCondition,
  setSaleCondition,
}: InvoiceInfoProps) {

  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sales.create.condition")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
            <Select value={saleCondition} onValueChange={(value) => setSaleCondition(value as "CASH" | "CREDIT")}>
              <SelectTrigger id="sale-condition">
                <SelectValue placeholder={t("placeholder.select")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">{t("invoices.type.cash")}</SelectItem>
                <SelectItem value="CREDIT">{t("invoices.type.credit")}</SelectItem>
              </SelectContent>
            </Select>
      </CardContent>
    </Card>
  );
}
