import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardContentSkeleton() {
  return (
    <div className="text-sm sm:text-base flex flex-col gap-6 mt-4 p-4 ">
      <div className="flex md:flex-row flex-col items-center w-full gap-3 ">
        <Skeleton className="h-16 w-full md:w-[500px]" />
        <Skeleton className="h-16 w-full md:w-[500px]" />
        <Skeleton className="h-16 w-full md:w-[500px]" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Distribución por servicio</h2>
          <Skeleton className="h-48" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Distribución por tipo de factura</h2>
          <Skeleton className="h-48" />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2 ">Ingresos mensuales</h2>
        <Skeleton className="h-64" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2 ">Citas por mes</h2>
        <Skeleton className="h-64 animate-pulse" />
      </div>
    </div>
  );
}