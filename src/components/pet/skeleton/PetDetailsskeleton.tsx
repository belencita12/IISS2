import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function PetDetailsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-purple-50">
      <div className="relative">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-40 sm:h-48 shadow-md" />

        {/* Tarjeta principal */}
        <div className="container mx-auto px-4">
          <Card className="mt-[-70px] sm:mt-[-80px] shadow-xl border-none overflow-visible">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Sección de imagen y nombre */}
                <div className="w-full md:w-1/3 p-4 sm:p-6 flex flex-col items-center">
                  <div className="relative mb-4 mt-[-40px] sm:mt-[-50px]">
                    <div className="rounded-full p-1.5 bg-white shadow-lg relative">
                      <div className="rounded-full overflow-hidden w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[250px] md:h-[250px] ring-4 ring-purple-100">
                        <Skeleton className="w-full h-full" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Skeleton className="h-7 w-40 mb-1" />
                    <Skeleton className="h-5 w-24 mb-3 rounded-full" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>

                {/* Sección de información */}
                <div className="w-full md:w-2/3 p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Card
                        key={index}
                        className="border border-purple-100 shadow-sm"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-6 w-32" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sección de vacunas y citas */}
      <div className="w-full px-4 py-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-6">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}