import { Skeleton } from "@/components/ui/skeleton";

export default function PetListsSkeleton() {
  return (
    <section className="w-full mt-10 bg-white text-center px-4">

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 justify-items-center">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col w-full max-w-[260px] rounded-lg shadow-md overflow-hidden bg-white text-gray-900"
          >
            <div className="relative w-full h-[180px] flex items-center justify-center bg-gray-100">
              <Skeleton className="w-40 h-40 rounded-full" />
            </div>
            <div className="p-3 flex flex-col justify-between flex-1 overflow-hidden">
              <div className="flex flex-col space-y-2 overflow-hidden">
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="flex justify-center mt-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}