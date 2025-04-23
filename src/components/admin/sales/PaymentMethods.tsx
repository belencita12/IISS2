"use client";

import { useEffect, useState } from "react";
import NumericInput from "@/components/global/NumericInput";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useFetch } from "@/hooks/api";
import { PAYMENT_METHOD_API } from "@/lib/urls";
import {
  PaymentMethod,
  PaymentMethodResponse,
} from "@/lib/sales/IPaymentMethod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Importando el RadioGroupItem y RadioGroup
import PaymentMethodsSkeleton from "./skeleton/PaymentMethodsSkeleton";

type Props = {
  token: string;
  onPaymentMethodsChange: (
    methods: { method: string; amount: number }[]
  ) => void;
  onSelectedMethodChange: (method: string) => void;
  selectedMethod: string;
  thereIsProducts?: boolean;
};

export default function PaymentMethods({
  token,
  onPaymentMethodsChange,
  onSelectedMethodChange,
  selectedMethod,
  thereIsProducts = false,
}: Props) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [payments, setPayments] = useState<
    { method: string; amount: number }[]
  >([]);

  const { data, get, loading } = useFetch<PaymentMethodResponse>("", token);

  useEffect(() => {
    get(undefined, `${PAYMENT_METHOD_API}?page=1&size=5`);
  }, []);

  useEffect(() => {
    if (data) {
      setMethods(data.data);
      if (data.data.length > 0)
        onSelectedMethodChange(data.data[0].id.toString());
    }
  }, [data]);

  const handleAdd = () => {
    const parsedAmount = parseFloat(amount);
    if (!selectedMethod || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const updated = [
      ...payments,
      { method: selectedMethod, amount: parsedAmount },
    ];
    setPayments(updated);
    setAmount("");
    onPaymentMethodsChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = payments.filter((_, i) => i !== index);
    setPayments(updated);
    onPaymentMethodsChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pago</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex-col items-end gap-4">
          {loading ? (
            <PaymentMethodsSkeleton />
          ) : (
            <div className="flex-1 pb-4">
              {/* Usando RadioGroup con RadioGroupItem en lugar de select */}
              <RadioGroup
                value={selectedMethod}
                onValueChange={onSelectedMethodChange}
              >
                {methods.map((m) => (
                  <div key={m.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={m.id.toString()} id={`r-${m.id}`} />
                    <label htmlFor={`r-${m.id}`} className="text-sm">
                      {m.name}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex-1 flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monto</label>
              <NumericInput
                id="payment-amount"
                type="formattedNumber"
                placeholder={amount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!thereIsProducts}
              />
            </div>
            <Button onClick={handleAdd} disabled={!thereIsProducts}>
              Agregar
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Método</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {methods.find((m) => m.id.toString() === p.method)?.name ||
                    p.method}
                </TableCell>
                <TableCell>{p.amount.toLocaleString("ES-PY")} Gs.</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleRemove(idx)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
