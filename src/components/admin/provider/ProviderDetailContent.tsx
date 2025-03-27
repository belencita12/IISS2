import React, { useState, useEffect } from "react";
import { X, Phone, FileText } from "lucide-react";
import { Provider } from "@/lib/provider/IProvider";
import { getProviderById } from "@/lib/provider/getProviderById";

interface ProviderDetailContentProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  providerId: number | null;
}

export const ProviderDetail: React.FC<ProviderDetailContentProps> = ({
  token,
  isOpen,
  onClose,
  providerId
}) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      if (isOpen && providerId) {
        setIsLoading(true);
        try {
          const fetchedProvider = await getProviderById(providerId, token);
          setProvider(fetchedProvider);
        } catch (error) {
          console.error("Error fetching provider details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProviderDetails();
  }, [isOpen, providerId, token]);

  return (
    <div className="space-y-4">
      <div className="text-center relative">
        {/* Botón de cierre (X) */}
        <button
          onClick={onClose}
          className="absolute bottom-8 right-1 text-gray-600 hover:text-gray-800"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <h2 className="text-xl font-bold mt-4">
          {isLoading ? "Cargando detalles del proveedor..." : provider?.businessName || "Detalles del Proveedor"}
        </h2>
      </div>
      
      {/* Ajustar margen inferior de la línea divisoria */}
      <div className="border-t border-gray-300 mt-1 w-full"></div> {/* Cambié el mt-2 por mt-1 */}

      {!isLoading && provider ? (
        <div className="space-y-4">
          <div className="pl-2">
            <p className="text-sm text-gray-600">Descripción:</p>
            <p className="font-medium">{provider.description}</p>
          </div>

          <div className="border rounded-lg p-3 pl-2">
            <p className="text-sm text-gray-600">Contacto:</p>
            <div className="mt-2 flex items-center space-x-3">
              <Phone size={20} className="text-black-600" />
              <div>
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="text-base">{provider.phoneNumber}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <FileText size={20} className="text-black-600" />
              <div>
                <p className="text-xs text-gray-500">RUC</p>
                <p className="text-base">{provider.ruc}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !isLoading && <div className="text-center text-red-500 mt-4">No se pudieron cargar los detalles del proveedor</div>
      )}
    </div>
  );
};
