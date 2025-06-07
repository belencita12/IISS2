import { Skeleton } from "@/components/ui/skeleton";

export default function PetsTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-6 gap-x-4 py-3 border-b">
            <div className="col-span-2 flex justify-start">
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="col-span-1 flex justify-end">
              <Skeleton className="h-5 w-16" />
            </div>
          </div>

          {/* Rows */}
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-x-4 py-4 border-b"
              >
                <div className="col-span-2 flex justify-start">
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="col-span-1">
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="col-span-1 flex justify-end gap-2">
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
