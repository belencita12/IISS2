import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Validación de Zod para el número de factura en formato 001-001-00000001
const invoiceNumberSchema = z.string().regex(/^\d{3}-\d{3}-\d{8}$/, {
  message: "El número de factura debe tener el formato 001-001-00000001",
});

// Validación de Zod para el número de timbrado con 8 dígitos
const timbradoNumberSchema = z.string().regex(/^\d{8}$/, {
  message: "El número de timbrado debe tener 8 dígitos",
});

// Props que el componente recibirá
type InvoiceInfoProps = {
  invoiceNumber: string;
  timbradoNumber: string;
  setInvoiceNumber: (value: string) => void;
  setTimbradoNumber: (value: string) => void;
};

export default function InvoiceInfo({
  invoiceNumber,
  timbradoNumber,
  setInvoiceNumber,
  setTimbradoNumber,
}: InvoiceInfoProps) {
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [timbradoError, setTimbradoError] = useState<string | null>(null);

  // Función de validación para el número de factura
  const validateInvoiceNumber = (value: string) => {
    const trimmedValue = value.trim(); // Eliminamos los espacios en blanco antes de validar
    try {
      invoiceNumberSchema.parse(trimmedValue); // Validamos el número de factura
      setInvoiceError(null); // Si es válido, eliminamos el error
    } catch (error) {
      if (error instanceof z.ZodError) {
        setInvoiceError(error.errors[0].message); // Si no es válido, mostramos el mensaje de error
      }
    }
  };

  // Función de validación para el número de timbrado
  const validateTimbradoNumber = (value: string) => {
    const trimmedValue = value.trim(); // Eliminamos los espacios en blanco antes de validar
    try {
      timbradoNumberSchema.parse(trimmedValue); // Validamos el número de timbrado
      setTimbradoError(null); // Si es válido, eliminamos el error
    } catch (error) {
      if (error instanceof z.ZodError) {
        setTimbradoError(error.errors[0].message); // Si no es válido, mostramos el mensaje de error
      }
    }
  };

  // Manejadores de cambio
  const handleInvoiceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInvoiceNumber(value);
    validateInvoiceNumber(value); // Validamos el número de factura en cada cambio
  };

  const handleTimbradoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimbradoNumber(value);
    validateTimbradoNumber(value); // Validamos el número de timbrado en cada cambio
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
              onChange={handleInvoiceNumberChange} // Usamos el manejador de cambios
              placeholder="001-001-00000001"
            />
            {invoiceError && <p className="text-red-500 text-sm mt-1">{invoiceError}</p>} {/* Error de factura */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="timbrado-number">Número de Timbrado</Label>
            <Input
              id="timbrado-number"
              value={timbradoNumber}
              onChange={handleTimbradoNumberChange} // Usamos el manejador de cambios
              placeholder="12345678"
            />
            {timbradoError && <p className="text-red-500 text-sm mt-1">{timbradoError}</p>} {/* Error de timbrado */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
