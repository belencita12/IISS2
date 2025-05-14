import { Skeleton } from "@/components/ui/skeleton";

export default function MovementDetailSkeleton() {
  return (
   <div className="container mx-auto p-4 max-w-6xl space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="p-6 border shadow-sm rounded-md bg-white space-y-4">
        <InfoRowSkeleton />
        <InfoRowSkeleton />
        <InfoRowSkeleton />
    
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-full rounded-md" />
          <div className="flex justify-start mt-2">
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </div>

      <Skeleton className="h-6 w-32" />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex p-4 items-start gap-4 shadow-sm border rounded-md bg-white"
          >
            <Skeleton className="w-20 h-20 rounded-md border" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoRowSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3 rounded-md" />
    </div>
  );
}