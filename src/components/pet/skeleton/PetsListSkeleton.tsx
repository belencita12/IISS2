import { Skeleton } from "@/components/ui/skeleton";

export default function PetsListSkeleton() {
  return (
    <div className="flex flex-col space-y-4 pb-10">
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="flex items-center md:mx-20 gap-4 p-4 border border-gray-100 rounded-lg shadow-sm"
          >
            <div className="w-16 h-16">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-5 sm:h-3 w-3/4" />
              <Skeleton className="h-5 sm:h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
    </div>
  );
}
