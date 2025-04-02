import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TagTableSkeleton = () => {
  return (
    <div className="rounded-md border">
      <div className="p-2">
        <div className="space-y-2">
          <div className="flex flex-row justify-between pb-2 border-b">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-row justify-between items-center py-2 border-b"
              >
                <Skeleton className="h-5 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TagTableSkeleton;
