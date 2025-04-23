"use client"

import { useState } from "react"
import { Save, Printer, Trash2, BarChart2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductWithExtraData as Product } from "@/lib/products/IProducts"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import CustomerSearch from "./CustomerSearch"
import ProductList from "./ProductList"
import ProductSearch from "./ProductSearch"
import DepositSearch from "./DepositSearch"
import { toast } from "@/lib/toast"

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

type Props = {
  token: string
}

export default function SaleCreation(
  { token }: Props
) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [paymentMethods, setPaymentMethods] = useState<Array<{ method: string; amount: number }>>([])
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState("efectivo")
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("")
  const [depositError, setDepositError] = useState<string | undefined>(undefined)
  const [timbradoNumber, setTimbradoNumber] = useState("")
  const [timbradoValidFrom, setTimbradoValidFrom] = useState("")
  const [timbradoValidTo, setTimbradoValidTo] = useState("")

  // Calcular el total de la factura
  const subtotal = products.reduce((sum, product) => sum + product.total, 0)
  const tax = subtotal * 0.10 // 10% de impuesto
  const total = subtotal + tax

  // Función para agregar un producto a la lista
  const addProduct = (product: Product) => {
    // Verificar si el producto ya existe en la lista
    const existingProductIndex = products.findIndex((p) => p.id === product.id)

    if (existingProductIndex >= 0) {
      // Si existe, actualizar la cantidad y el total
      const updatedProducts = [...products]
      updatedProducts[existingProductIndex].quantity += 1
      updatedProducts[existingProductIndex].total =
        updatedProducts[existingProductIndex].price * updatedProducts[existingProductIndex].quantity
      setProducts(updatedProducts)
    } else {
      // Si no existe, agregar a la lista
      setProducts([...products, product])
    }
  }

  // Función para eliminar un producto de la lista
  const removeProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  // Función para actualizar la cantidad de un producto
  const updateProductQuantity = (productId: string, quantity: number) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          quantity,
          total: product.price * quantity,
        }
      }
      return product
    })

    setProducts(updatedProducts)
  }

  const addPaymentMethod = () => {
    if (!currentPaymentAmount || Number.parseFloat(currentPaymentAmount) <= 0) return

    setPaymentMethods([
      ...paymentMethods,
      {
        method: currentPaymentMethod,
        amount: Number.parseFloat(currentPaymentAmount),
      },
    ])

    setCurrentPaymentAmount("")
  }

  // Add a function to remove payment methods
  const removePaymentMethod = (index: number) => {
    const updatedPaymentMethods = [...paymentMethods]
    updatedPaymentMethods.splice(index, 1)
    setPaymentMethods(updatedPaymentMethods)
  }

  // Calculate the total amount paid and remaining balance
  const totalPaid = paymentMethods.reduce((sum, payment) => sum + payment.amount, 0)
  const remainingBalance = Math.max(0, total - totalPaid)

  // Handle warehouse selection with validation
  const handleSelectWarehouse = (depositId: string) => {
    setSelectedWarehouse(depositId)
    setDepositError(undefined) // Clear any previous errors
  }

  const handleFinalizeSale = () => {
    // Validate deposit is selected
    if (!selectedWarehouse) {
      setDepositError("Debe seleccionar un depósito")
      toast("error", "Debe seleccionar un depósito")
      return
    }

    // Add other validations as needed
    if (!selectedCustomer) {
      toast("error", "Debe seleccionar un cliente")
      return
    }

    if (products.length === 0) {
      toast("error", "Debe agregar al menos un producto")
      return
    }

    // Perform the sale submission
    toast("success", "Venta finalizada correctamente")
    // Reset form or redirect as needed
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Selección de depósito */}
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <DepositSearch 
              token={token}
              value={selectedWarehouse}
              onSelectDeposit={handleSelectWarehouse}
              error={depositError}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del cliente y factura */}
        <div className="lg:col-span-1 space-y-6">
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
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="INV-9709"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timbrado-number">Número de Timbrado</Label>
                  <Input
                    id="timbrado-number"
                    value={timbradoNumber}
                    onChange={(e) => setTimbradoNumber(e.target.value)}
                    placeholder="12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-date">Fecha</Label>
                  <Input id="invoice-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CustomerSearch onSelectCustomer={setSelectedCustomer} />

              {selectedCustomer && (
                <div className="border rounded-md p-3 bg-gray-50">
                  <h3 className="font-medium">{selectedCustomer.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <RadioGroup
                  defaultValue="efectivo"
                  value={currentPaymentMethod}
                  onValueChange={setCurrentPaymentMethod}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="efectivo" id="efectivo" />
                    <Label htmlFor="efectivo">Efectivo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                    <Label htmlFor="tarjeta">Tarjeta</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transferencia" id="transferencia" />
                    <Label htmlFor="transferencia">Transferencia</Label>
                  </div>
                </RadioGroup>

                {currentPaymentMethod === "tarjeta" && (
                  <div className="pt-2 space-y-2">
                    <Label htmlFor="card-number">Número de Tarjeta</Label>
                    <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="expiry">Fecha de Expiración</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                {currentPaymentMethod === "transferencia" && (
                  <div className="pt-2 space-y-2">
                    <Label htmlFor="bank-account">Cuenta Bancaria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cuenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cuenta1">Banco Nacional - 1234567890</SelectItem>
                        <SelectItem value="cuenta2">Banco Comercial - 0987654321</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-end gap-2 pt-2">
                  <div className="flex-1">
                    <Label htmlFor="payment-amount">Monto</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      placeholder={remainingBalance.toFixed(2)}
                      value={currentPaymentAmount}
                      onChange={(e) => setCurrentPaymentAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={addPaymentMethod}
                    disabled={!currentPaymentAmount || Number.parseFloat(currentPaymentAmount) <= 0}
                  >
                    Agregar
                  </Button>
                </div>
              </div>

              {paymentMethods.length > 0 && (
                <div className="border rounded-md overflow-hidden mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Método</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentMethods.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {payment.method === "efectivo" && "Efectivo"}
                            {payment.method === "tarjeta" && "Tarjeta"}
                            {payment.method === "transferencia" && "Transferencia"}
                          </TableCell>
                          <TableCell className="text-right">{payment.amount.toFixed(2)} Gs.</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removePaymentMethod(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Productos y resumen */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProductSearch onSelectProduct={addProduct} token={token} />

              <ProductList products={products} onRemove={removeProduct} onUpdateQuantity={updateProductQuantity} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de Venta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{subtotal.toFixed(2)} Gs.</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuesto:</span>
                  <span>{tax.toFixed(2)} Gs.</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{total.toFixed(2)} Gs.</span>
                </div>

                {paymentMethods.length > 0 && (
                  <>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between">
                      <span>Total Pagado:</span>
                      <span>{totalPaid.toFixed(2)} Gs.</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Saldo Pendiente:</span>
                      <span>{remainingBalance.toFixed(2)} Gs.</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                size="lg"
                disabled={
                  remainingBalance > 0 ||
                  !selectedWarehouse ||
                  !timbradoNumber ||
                  !timbradoValidFrom ||
                  !timbradoValidTo
                }
                title={
                  remainingBalance > 0
                    ? "El pago total debe cubrir el monto completo de la venta"
                    : !selectedWarehouse
                      ? "Debe seleccionar un depósito"
                      : !timbradoNumber || !timbradoValidFrom || !timbradoValidTo
                        ? "Complete la información de timbrado"
                        : ""
                }
                onClick={handleFinalizeSale}
              >
                Finalizar Venta
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
