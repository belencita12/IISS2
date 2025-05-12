import type { Invoice } from "@/lib/invoices/IInvoice"
import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { User, CreditCard } from "lucide-react"

interface Props {
  invoice: Invoice
}

export default function InvoiceDetailCard({ invoice }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PY").format(amount)
  }

  const getPaymentTypeLabel = () => {
    switch (invoice.type) {
      case "CREDIT":
        return "Crédito"
      case "CASH":
        return "Contado"
      default:
        return "Desconocido"
    }
  }

  return (
    <Card className="w-full mt-6 overflow-hidden border-border/40 shadow-sm">
      <div className="bg-muted/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
        <h2 className="text-xl font-semibold text-foreground">Factura Nº {invoice.invoiceNumber}</h2>
        <span className="text-sm text-muted-foreground mt-2 sm:mt-0">
          {formatDate(invoice.issueDate)}
        </span>
      </div>

      <CardContent className="p-0">
        <div className="px-6 py-3 bg-muted/10 border-b">
          <span className="text-sm">
            Timbrado: <span className="font-medium">{invoice.stamped}</span>
          </span>
        </div>

        <div className="px-6 py-3 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 relative">
          {/* Información del Cliente */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-sm">Información del Cliente</h3>
            </div>
            <div className="border-b border-border/60 mb-3 pb-1"></div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{invoice.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RUC</p>
                <p className="font-medium">{invoice.ruc}</p>
              </div>
            </div>
          </div>

          {/* Información de Pago */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-sm">Información de Pago</h3>
            </div>
            <div className="border-b border-border/60 mb-3 pb-1"></div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              {/* Columna izquierda */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Condición de venta</p>
                  <p className="font-medium">{getPaymentTypeLabel()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IVA</p>
                  <p className="font-medium">{formatCurrency(invoice.totalVat)} Gs.</p>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-3 text-right">
                <div>
                  <p className="text-sm text-muted-foreground">Monto Total</p>
                  <p className="font-medium">{formatCurrency(invoice.total)} Gs.</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pagado</p>
                  <p className="font-medium">{formatCurrency(invoice.totalPayed)} Gs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}