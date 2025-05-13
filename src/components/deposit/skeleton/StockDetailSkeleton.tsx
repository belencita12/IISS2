import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StockDetailSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="overflow-hidden mb-4">
          <div className="flex flex-col sm:flex-row p-4 animate-pulse">
            <div className="w-[100px] h-[100px] mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
              <Skeleton className="w-full h-full rounded" />
            </div>
            <div className="flex-1 min-w-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <div className="col-span-1 flex flex-wrap gap-1 items-start">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
