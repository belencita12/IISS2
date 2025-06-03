"use client";

export function StampedTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded mb-2" />
      ))}
    </div>
  );
} 