import React from "react";
import { Phone, Building2, Loader2 } from "lucide-react";
import { Provider } from "@/lib/provider/IProvider";
import { PROVIDER_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api"; // Importamos nuestro nuevo hook
import { Button } from "@/components/ui/button";

interface ProviderDetailProps {
  token: string;
  providerId: number;
  onClose: () => void;
}

export const ProviderDetail: React.FC<ProviderDetailProps> = ({ token, providerId, onClose }) => {
  // Utilizamos nuestro hook para obtener los datos del proveedor
  const { data: provider, loading: isLoading, error } = useFetch<Provider>(
    `${PROVIDER_API}/${providerId}`,
    token,
    { immediate: true } // Realizar la petición inmediatamente
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <h2 className="text-sm text-gray-600">Cargando detalles del proveedor...</h2>
          </div>
        ) : (
          <h2 className="text-xl font-bold mt-4">
            {provider?.businessName || "Detalles del Proveedor"}
          </h2>
        )}
      </div>

      <div className="border-t border-gray-300 mt-1 w-full"></div>

      {error && (
        <div className="text-center text-red-500 mt-4">
          Error al cargar los detalles del proveedor: {error.message}
        </div>
      )}

      {!isLoading && !error && provider ? (
        <div className="space-y-4">
          <div className="pl-2">
            <p className="text-sm text-gray-600">Descripción:</p>
            <p className="font-medium">{provider.description}</p>
          </div>

          <div className="border rounded-lg p-2 pl-2">
            <p className="text-sm text-gray-600">Contacto:</p>

            <div className="mt-2 flex items-center space-x-3">
              <Phone size={20} className="text-black-600" />
              <div>
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="text-base">{provider.phoneNumber}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-3">
              <Building2 size={20} className="text-black-600" />
              <div>
                <p className="text-xs text-gray-500">RUC</p>
                <p className="text-base">{provider.ruc}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !isLoading && !error && (
          <div className="text-center text-amber-500 mt-4">
            No se encontró información del proveedor
          </div>
        )
      )}
      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          className="px-6 border-gray-200 border-solid"
          onClick={onClose}
        >
          Volver
        </Button>
      </div>
    </div>
  );
};
