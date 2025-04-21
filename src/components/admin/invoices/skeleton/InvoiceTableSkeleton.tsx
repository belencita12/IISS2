"use client";

export default function InvoiceTableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-6" />
        <div className="flex flex-col space-y-4">
            {[...Array(7)].map((_, i) => (
            <div
                key={i}
                className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded">
                <div className="w-1/5 h-6 bg-gray-200 rounded" />
                <div className="w-1/5 h-6 bg-gray-200 rounded" />
                <div className="w-1/6 h-6 bg-gray-200 rounded" />
                <div className="w-1/6 h-6 bg-gray-200 rounded" />
                <div className="w-1/6 h-6 bg-gray-200 rounded" />
                <div className="w-1/6 h-6 bg-gray-200 rounded" />
            </div>
            ))}
        </div>
    </div>
  );
}
