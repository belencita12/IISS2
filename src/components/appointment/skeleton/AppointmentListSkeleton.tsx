import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentListSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-4 p-3 border-b border-gray-200 items-center"
        >
          {[...Array(6)].map((_, j) => (
            <Skeleton key={j} className="h-6 w-full rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
