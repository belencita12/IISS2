import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-pulse">
        <div className="md:col-span-4 flex justify-start">
          <Skeleton className="w-[300px] h-[300px] rounded-md" />
        </div>

        <div className="md:col-span-8 space-y-4 pl-6">
          <Skeleton className="h-10 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
          <div>
            <Skeleton className="h-4 w-1/3 mb-2" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-12 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4 pt-4"></h2>
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
