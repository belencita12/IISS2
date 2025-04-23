"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductWithExtraData as Product } from "@/lib/products/IProducts"

type ProductListProps = {
  products: Product[]
  onRemove: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
}

export default function ProductList({ products, onRemove, onUpdateQuantity }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay productos agregados. Busca y agrega productos a la venta.
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-center">Cantidad</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-right">{product.price.toLocaleString("ES-PY")} Gs.</TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => {
                      if (product.quantity > 1) {
                        onUpdateQuantity(product.id, product.quantity - 1)
                      }
                    }}
                    disabled={product.quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      if (!isNaN(value) && value > 0) {
                        onUpdateQuantity(product.id, value)
                      }
                    }}
                    className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">{product.total}  Gs.</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onRemove(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
