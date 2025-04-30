"use client";

import { useState } from "react";
import { ClientData } from "@/lib/admin/client/IClient";
import { Button } from "@/components/ui/button";
import { ProductWithExtraData as Product } from "@/lib/products/IProducts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomerSearch from "./CustomerSearch";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import DepositSearch from "./DepositSearch";
import { toast } from "@/lib/toast";
import PaymentMethods from "./PaymentMethods";
import { useFetch } from "@/hooks/api";
import { INVOICE_API } from "@/lib/urls";
import { InvoiceForm } from "@/lib/invoices/IInvoice";
import InvoiceInfo from "./InvoiceInfo";
import { useRouter } from "next/navigation";

type Props = {
  token: string;
};

export default function SaleCreation({ token }: Props) {
  const [selectedCustomer, setSelectedCustomer] = useState<ClientData | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<
    { method: string; amount: number }[]
  >([]);

  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [saleCondition, setSaleCondition] = useState<"CASH" | "CREDIT">("CASH");

  const [depositError, setDepositError] = useState<string | undefined>(
    undefined
  );
  const [timbradoNumber, setTimbradoNumber] = useState("");
  const router = useRouter();

  // Calcular el total de la factura
  const total = products.reduce((sum, product) => sum + product.total, 0);

  const { post, loading } = useFetch<InvoiceForm>(INVOICE_API, token);

  // Función para agregar un producto a la lista
  const addProduct = (product: Product) => {
    // Verificar si el producto ya existe en la lista
    const existingProductIndex = products.findIndex((p) => p.id === product.id);

    if (existingProductIndex >= 0) {
      // Si existe, actualizar la cantidad y el total
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity += 1;
      updatedProducts[existingProductIndex].total =
        updatedProducts[existingProductIndex].price *
        updatedProducts[existingProductIndex].quantity;
      setProducts(updatedProducts);
    } else {
      // Si no existe, agregar a la lista
      setProducts([...products, product]);
    }
  };

  // Función para eliminar un producto de la lista
  const removeProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  // Función para actualizar la cantidad de un producto
  const updateProductQuantity = (productId: string, quantity: number) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          quantity,
          total: product.price * quantity,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  // Calculate the total amount paid and remaining balance
  const totalPaid = paymentMethods.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const remainingBalance = total - totalPaid;

  // Handle warehouse selection with validation
  const handleSelectWarehouse = (depositId: string) => {
    setSelectedStock(depositId);
    setDepositError(undefined); // Clear any previous errors
  };

  const handleFinalizeSale = async () => {
    if (!selectedStock) {
      setDepositError("Debe seleccionar un depósito");
      toast("error", "Debe seleccionar un depósito");
      return;
    }

    if (!selectedCustomer) {
      toast("error", "Debe seleccionar un cliente");
      return;
    }

    if (products.length === 0) {
      toast("error", "Debe agregar al menos un producto");
      return;
    }

    const saleData: InvoiceForm = {
      invoiceNumber,
      stamped: timbradoNumber,
      clientId: Number(selectedCustomer.id),
      stockId: Number(selectedStock),
      issueDate: new Date().toLocaleDateString("en-CA"),
      details: products.map((p) => ({
        quantity: p.quantity,
        productId: Number(p.id),
      })),
      paymentMethods: paymentMethods.map((p) => ({
        methodId: Number(p.method),
        amount: p.amount,
      })),
      totalPayed: totalPaid || 1,
      type: saleCondition,
      services: [],
    };

    try {
      const { error } = await post(saleData);
      if (!error && !loading) {
        toast("success", "Venta finalizada con éxito");
        router.push("/dashboard/invoices");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast("error", error.message);
      }
    }
  };

  return (
    <div className="container mx-auto py-2s">
      {/* Selección de depósito */}
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <DepositSearch
              token={token}
              value={selectedStock}
              onSelectDeposit={handleSelectWarehouse}
              error={depositError}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del cliente y factura */}
        <div className="lg:col-span-1 space-y-6">
          <InvoiceInfo
            saleCondition={saleCondition}
            setSaleCondition={setSaleCondition}
            invoiceNumber={invoiceNumber}
            timbradoNumber={timbradoNumber}
            setInvoiceNumber={setInvoiceNumber}
            setTimbradoNumber={setTimbradoNumber}
          />
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CustomerSearch
                onSelectCustomer={setSelectedCustomer}
                token={token}
              />

              {selectedCustomer && (
                <div className="border rounded-md p-3 bg-gray-50">
                  <h3 className="font-medium">{selectedCustomer.fullName}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedCustomer.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          {saleCondition === "CASH" && (
            <PaymentMethods
              onPaymentMethodsChange={setPaymentMethods}
              thereIsProducts={products.length > 0}
              selectedMethod={selectedMethod}
              onSelectedMethodChange={setSelectedMethod}
              token={token}
            />
          )}
        </div>

        {/* Columna derecha - Productos y resumen */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedStock ? (
                <div className="text-center py-8 text-muted-foreground">
                  Selecciona un depósito para continuar.
                </div>
              ) : (
                <>
                  <ProductSearch
                    stockId={selectedStock}
                    onSelectProduct={addProduct}
                    token={token}
                  />

                  <ProductList
                    products={products}
                    onRemove={removeProduct}
                    onUpdateQuantity={updateProductQuantity}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de Venta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{total.toLocaleString("ES-PY")} Gs.</span>
                </div>

                {paymentMethods.length > 0 && (
                  <>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between">
                      <span>Total Pagado:</span>
                      <span>{totalPaid.toLocaleString("ES-PY")} Gs.</span>
                    </div>
                    {remainingBalance > 0 && (
                      <div className="flex justify-between text-red-500 font-medium">
                        <span>
                          Faltan {remainingBalance.toLocaleString("ES-PY")} Gs.
                          para completar el pago.
                        </span>
                      </div>
                    )}
                    {remainingBalance < 0 && (
                      <div className="flex justify-between text-red-500 font-medium">
                        <span>
                          El monto excede por{" "}
                          {Math.abs(remainingBalance).toLocaleString("ES-PY")}{" "}
                          Gs.
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                size="lg"
                disabled={
                  (saleCondition === "CASH" && remainingBalance !== 0) ||
                  !selectedStock ||
                  !timbradoNumber ||
                  !selectedCustomer ||
                  products.length === 0 ||
                  loading
                }
                title={
                  remainingBalance > 0 && saleCondition === "CASH"
                    ? "El pago total debe cubrir el monto completo de la venta"
                    : !selectedStock
                    ? "Debe seleccionar un depósito"
                    : !timbradoNumber
                    ? "Complete la información de timbrado"
                    : ""
                }
                onClick={handleFinalizeSale}
              >
                {loading ? "Finalizando..." : "Finalizar Venta"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
