import { Skeleton } from "@/components/ui/skeleton";

export default function ReceiptListSkeleton() {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-4 pt-4">Recibos</h2>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 border-b border-gray-200"
        >
          <Skeleton className="h-6 w-1/4 rounded" />
          <Skeleton className="h-6 w-1/4 rounded" />
          <Skeleton className="h-6 w-1/6 rounded" />
          <Skeleton className="h-6 w-1/6 rounded" />
        </div>
      ))}
    </div>
  );
}
