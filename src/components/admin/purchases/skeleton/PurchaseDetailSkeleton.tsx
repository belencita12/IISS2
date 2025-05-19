import { Skeleton } from "@/components/ui/skeleton";
import ProductListSkeleton from "../../product/skeleton/ProductListSkeleton";

export default function PurchaseDetailSkeleton() {
  return (
    <><div className="flex flex-col gap-4 w-full animate-pulse">
      <h1 className="text-3xl font-bold text-center mt-4 mb-2"></h1>
      <div className="p-4 border rounded-md shadow bg-white w-full flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">

          <div className="space-y-2 md:w-1/2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="md:w-1/2"></div>
        </div>
      </div>
    </div><ProductListSkeleton /></>
  );
}
