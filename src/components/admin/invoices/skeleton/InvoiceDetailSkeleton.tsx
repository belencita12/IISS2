import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <div className="bg-white border border-gray-300 rounded-lg p-4 w-full mt-6">
        <div className="grid grid-cols-2 grid-rows-6 gap-x-3 gap-y-4">
          <Skeleton className="col-span-1 h-6 w-32" />
          <Skeleton className="col-span-1 h-4 w-20 justify-self-end" />

          <Skeleton className="col-span-1 h-4 w-24" />
          <Skeleton className="col-span-1 h-4 w-28 justify-self-end" />

          <Skeleton className="col-span-1 h-4 w-40" />
          <Skeleton className="col-span-1 h-6 w-32 justify-self-end" />

          <Skeleton className="col-span-1 h-4 w-28" />
          <Skeleton className="col-span-1 h-6 w-28 justify-self-end" />

          <Skeleton className="col-span-1 h-4 w-20" />
          <Skeleton className="col-span-1 h-6 w-24 justify-self-end" />

          <Skeleton className="col-span-1 h-4 w-32" />
          <Skeleton className="col-span-1 h-4 w-20 justify-self-end" />
        </div>
      </div>
      <div className="w-full animate-pulse">
        <Skeleton className="h-10 w-full rounded mb-4" />
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border-b border-gray-200"
          >
            <Skeleton className="w-1/4 h-6 rounded" />
            <Skeleton className="w-1/4 h-6 rounded" />
            <Skeleton className="w-1/6 h-6 rounded" />
            <Skeleton className="w-1/6 h-6 rounded" />
            <Skeleton className="w-1/6 h-6 rounded" />
            <Skeleton className="w-1/6 h-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
