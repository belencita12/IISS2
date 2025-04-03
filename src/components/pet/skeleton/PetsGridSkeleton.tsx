import { Skeleton } from "@/components/ui/skeleton";

export default function PetsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="bg-gray-50 w-full h-96 sm:h-72 lg:h-96 flex flex-col gap-4 p-4 sm:p-2 rounded-lg">
            <div className="w-full h-full">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-9 w-full mt-2" />
            </div>
          </div>
        ))}
    </div>
  );
}
