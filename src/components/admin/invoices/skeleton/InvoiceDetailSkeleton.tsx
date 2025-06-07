import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <Card className="w-full mt-6 overflow-hidden border-border/40 shadow-sm">
        <div className="bg-muted/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2 sm:mt-0" />
        </div>

        <CardContent className="p-0">
          <div className="px-6 py-3 bg-muted/10 border-b">
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="border-b border-border/60 pb-1" />
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="border-b border-border/60 pb-1" />
              <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
                <div className="space-y-3">
                  <div>
                    <Skeleton className="h-3 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="space-y-3 text-right">
                  <div>
                    <Skeleton className="h-3 w-24 mb-1 ml-auto" />
                    <Skeleton className="h-4 w-32 ml-auto" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-28 mb-1 ml-auto" />
                    <Skeleton className="h-4 w-36 ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="w-full animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 items-center"
          >
            {[...Array(5)].map((_, j) => (
              <Skeleton key={j} className="h-6 w-full rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
