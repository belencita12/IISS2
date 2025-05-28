import { Skeleton } from "@/components/ui/skeleton";

export default function ReceiptDetailSkeleton() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mt-12 mb-6">
        <h1 className="text-2xl font-bold">Detalle del Recibo</h1>
        <Skeleton className="h-10 w-32 mb-4" />{" "}
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Información del Recibo */}
        <section className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
        </section>

        {/* Métodos de Pago */}
        <section className="space-y-4">
          <Skeleton className="h-6 w-48" />
          {[...Array(3)].map((_, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 border-b pb-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </section>

        {/* Datos de la Factura */}
        <section className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
