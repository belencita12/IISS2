import { Skeleton } from "@/components/ui/skeleton";

export default function SpeciesTableSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-1/4" /> {/* Nombre */}
                    <Skeleton className="h-4 w-1/2" /> {/* Descripción */}
                    <Skeleton className="h-4 w-16 ml-auto" /> {/* Acciones */}
                </div>
            ))}
        </div>
    );
}
