"use client";

import { useEffect, useState } from "react";
import NumericInput from "@/components/global/NumericInput";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PaymentMethodsSkeleton from "@/components/admin/sales/skeleton/PaymentMethodsSkeleton";

type Props = {
  token: string;
  onPaymentMethodsChange: (
    methods: { method: string; amount: number }[]
  ) => void;
  onSelectedMethodChange: (method: string) => void;
  selectedMethod: string;
};

export default function PaymentMethods({
  token,
  onPaymentMethodsChange,
  onSelectedMethodChange,
  selectedMethod,
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
      if (data.data.length > 0) {
        onSelectedMethodChange(data.data[0].id.toString());
      }
    }
  }, [data]);

  const handleAdd = () => {
    const parsedAmount = parseFloat(amount);
    if (!selectedMethod || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const existingIndex = payments.findIndex(
      (p) => p.method === selectedMethod
    );

    let updated: { method: string; amount: number }[];

    if (existingIndex !== -1) {
      updated = payments.map((p, idx) =>
        idx === existingIndex ? { ...p, amount: p.amount + parsedAmount } : p
      );
    } else {
      updated = [...payments, { method: selectedMethod, amount: parsedAmount }];
    }

    setPayments(updated);
    setAmount("");
    onPaymentMethodsChange(updated);
  };

  const handleEditAmount = (index: number, value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) return;

    const updated = payments.map((p, idx) =>
      idx === index ? { ...p, amount: parsed } : p
    );

    setPayments(updated);
    onPaymentMethodsChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = payments.filter((_, i) => i !== index);
    setPayments(updated);
    onPaymentMethodsChange(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <PaymentMethodsSkeleton />
          ) : (
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
          )}

          <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Monto</label>
              <NumericInput
                id="payment-amount"
                type="formattedNumber"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd}>Agregar</Button>
          </div>
        </CardContent>
      </div>

      {payments.length > 0 && (
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
                <TableCell>
                  <NumericInput
                    id={`payment-amount-${idx}`}
                    type="formattedNumber"
                    placeholder={p.amount.toString()}
                    value={p.amount.toString()}
                    onChange={(e) => handleEditAmount(idx, e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleRemove(idx)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
