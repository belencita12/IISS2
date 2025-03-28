export default function WorkPositionTableSkeleton() {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }
  