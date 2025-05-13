import { Skeleton } from "@/components/ui/skeleton";

export default function VaccineRegistryDetailSkeleton() {
  const details = [
    "Vacuna",
    "Fabricante",
    "Mascota",
    "Dueño",
    "Dosis aplicada",
    "Fecha de aplicación",
    "Próxima aplicación",
  ];

  return (
    <div className="flex flex-col justify-between mt-5 p-4 mx-2">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">
          Detalle del Registro de Vacunación
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((label, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-1"
            >
              <span className="text-gray-500">{label}</span>
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-6 justify-end">
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
      </div>
    </div>
  );
}
