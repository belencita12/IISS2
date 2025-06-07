import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentMethodsSkeleton() {
  return (
    <div className="flex-col items-end gap-4">
      <div className="flex-1 pb-4">
        {/* Radio options skeleton */}
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
      </div>
    </div>
  );
}
