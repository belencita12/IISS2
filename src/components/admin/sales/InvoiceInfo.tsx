import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Props que el componente recibirá
type InvoiceInfoProps = {
  saleCondition: "CASH" | "CREDIT";
  setSaleCondition: (value: "CASH" | "CREDIT") => void;
};

export default function InvoiceInfo({
  saleCondition,
  setSaleCondition,
}: InvoiceInfoProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Condición de Venta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
            <Select value={saleCondition} onValueChange={(value) => setSaleCondition(value as "CASH" | "CREDIT")}>
              <SelectTrigger id="sale-condition">
                <SelectValue placeholder="Seleccionar condición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Contado</SelectItem>
                <SelectItem value="CREDIT">Crédito</SelectItem>
              </SelectContent>
            </Select>
      </CardContent>
    </Card>
  );
}
