import { Skeleton } from "@/components/ui/skeleton";

export default function PetVaccinationListSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded mb-4 "></div>
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
