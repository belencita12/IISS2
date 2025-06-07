import { Skeleton } from "@/components/ui/skeleton";

export default function SpeciesTableSkeleton() {
    return (
        <div className="space-y-5">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-6 w-1/4" /> {/* Nombre */}
                    <Skeleton className="h-6 w-16 ml-auto" /> {/* Acciones */}
                </div>
            ))}
        </div>
    );
}
