import { Skeleton } from "@/components/ui/skeleton";

export default function PurchaseSearchSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-full col-span-1" />
      <Skeleton className="h-6 w-full col-span-2" />
    </div>
  );
}
