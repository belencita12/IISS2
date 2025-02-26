import { LoaderCircleIcon } from "lucide-react";

export function Loading() {
  return (
    <div className="flex items-center justify-between w-full">
      <span className="">Cargando...</span>
      <LoaderCircleIcon className="lucide lucide-loader-circle animate-spin" />
    </div>
  );
}
