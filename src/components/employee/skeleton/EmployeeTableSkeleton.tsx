"use client";

export default function EmployeeTableSkeleton() {
    return (
        <div className="w-full animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-gray-200">
                    <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
                    <div className="w-1/6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-1/6 h-6 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    );
}
