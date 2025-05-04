import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Validación de Zod para el número de factura en formato 123-123-1234567
const invoiceNumberSchema = z.string().regex(/^\d{3}-\d{3}-\d{7}$/, {
  message: "El número de factura debe tener el formato 123-123-1234567",
});

// Validación de Zod para el número de timbrado con 8 dígitos
const timbradoNumberSchema = z.string().regex(/^\d{8}$/, {
  message: "El número de timbrado debe tener 8 dígitos",
});

// Props que el componente recibirá
type InvoiceInfoProps = {
  invoiceNumber: string;
  timbradoNumber: string;
  saleCondition: "CASH" | "CREDIT";
  setInvoiceNumber: (value: string) => void;
  setTimbradoNumber: (value: string) => void;
  setSaleCondition: (value: "CASH" | "CREDIT") => void;
};

export default function InvoiceInfo({
  invoiceNumber,
  timbradoNumber,
  saleCondition,
  setInvoiceNumber,
  setTimbradoNumber,
  setSaleCondition,
}: InvoiceInfoProps) {
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [timbradoError, setTimbradoError] = useState<string | null>(null);

  // Función de validación para el número de factura
  const validateInvoiceNumber = (value: string) => {
    const trimmedValue = value.trim();
    try {
      invoiceNumberSchema.parse(trimmedValue);
      setInvoiceError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setInvoiceError(error.errors[0].message);
      }
    }
  };

  // Función de validación para el número de timbrado
  const validateTimbradoNumber = (value: string) => {
    const trimmedValue = value.trim();
    try {
      timbradoNumberSchema.parse(trimmedValue);
      setTimbradoError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setTimbradoError(error.errors[0].message);
      }
    }
  };

  // Manejadores de cambio
  const handleInvoiceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInvoiceNumber(value);
    validateInvoiceNumber(value);
  };

  const handleTimbradoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimbradoNumber(value);
    validateTimbradoNumber(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Factura</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoice-number">Número de Factura</Label>
            <Input
              id="invoice-number"
              value={invoiceNumber}
              onChange={handleInvoiceNumberChange}
              placeholder="123-123-1234567"
            />
            {invoiceError && <p className="text-red-500 text-sm mt-1">{invoiceError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="timbrado-number">Número de Timbrado</Label>
            <Input
              id="timbrado-number"
              value={timbradoNumber}
              onChange={handleTimbradoNumberChange}
              placeholder="12345678"
            />
            {timbradoError && <p className="text-red-500 text-sm mt-1">{timbradoError}</p>}
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="sale-condition">Condición de Venta</Label>
            <Select value={saleCondition} onValueChange={(value) => setSaleCondition(value as "CASH" | "CREDIT")}>
              <SelectTrigger id="sale-condition">
                <SelectValue placeholder="Seleccionar condición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Contado</SelectItem>
                <SelectItem value="CREDIT">Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
