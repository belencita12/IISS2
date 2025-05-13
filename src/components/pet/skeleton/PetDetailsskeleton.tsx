import { Skeleton } from "@/components/ui/skeleton";

export default function PetDetailsSkeleton() {
  return (
   <div className="flex justify-center bg-gray-500 p-5 animate-pulse">
      <div className="flex-col justify-center items-center p-3 pr-8">
        <div className="w-[150px] h-[150px] rounded-full overflow-hidden mb-4">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex-col p-2 text-black text-center space-y-2">
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </div>
      </div>
      <div className="flex-col justify-start text-white text-xs space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-1 pb-3 space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}