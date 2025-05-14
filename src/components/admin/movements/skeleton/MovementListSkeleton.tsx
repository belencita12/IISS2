import { Skeleton } from "@/components/ui/skeleton";

export default function MovementListSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-md shadow bg-white w-full flex flex-col gap-4"
        >
          <Skeleton className="h-6 w-1/2" />

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2 md:w-1/2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            
            <div className="flex flex-col items-end text-right space-y-2 md:w-1/2">
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
