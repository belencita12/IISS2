import { Skeleton } from "@/components/ui/skeleton";

export default function PetsTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="space-y-3">
          {/* Table header skeleton */}
          <div className="grid grid-cols-4 gap-4 py-3 border-b">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          
          {/* Table rows skeleton */}
          {Array(3).fill(null).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 py-4 border-b">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}