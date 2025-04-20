import { Skeleton } from "@/components/ui/skeleton"

export const ProductCardSkeleton = () => {
    return (
        <div className="rounded-lg border shadow-sm overflow-hidden bg-white flex flex-col h-full">
            {/* Imagen simulada */}
            <Skeleton className="h-40 w-full" />

            {/* Contenido de la tarjeta */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Botón simulado */}
                <Skeleton className="h-9 w-full mt-4" />
            </div>
        </div>
    )
}

export const FiltersSkeleton = () => {
    return (
        <div className="w-full lg:w-1/4 bg-gray-50 rounded-lg border shadow-sm p-5 space-y-6 sticky top-4 h-fit">
            <div>
                <Skeleton className="h-6 w-24 mb-3" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div>
                <Skeleton className="h-6 w-20 mb-3" />
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>

            <div>
                <Skeleton className="h-6 w-20 mb-3" />
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="flex flex-wrap gap-2 mt-3">
                    <Skeleton className="h-7 w-16 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-14 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export const ProductCatalogSkeleton = () => {
    return (
        <div className="p-4 md:p-6 bg-white">
            {/* Buscador */}
            <Skeleton className="h-12 w-full lg:w-[100%] mb-8" />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filtros */}
                <FiltersSkeleton />

                {/* Tarjetas de productos */}
                <div className="w-full lg:w-[900px] flex flex-col">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array(8).fill(0).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* Paginación simulada */}
                    <div className="mt-10 flex justify-center">
                        <Skeleton className="h-10 w-48 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
