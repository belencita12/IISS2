"use client";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-lg relative p-6">
        <button
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800"
          aria-label="Cerrar"
        >
          <X size={16} /> 
        </button>

        {/* Encabezado del modal */}
        <div className="p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold">
              {isLoading ? "Cargando..." : provider?.businessName || "Detalles del Proveedor"}
            </h2>
          </div>
          {/* Línea debajo del título */}
          <div className="border-t border-gray-300 mt-2 w-full"></div>
        </div>

        {/* Contenido del modal */}
        {isLoading ? (
          <div className="text-center mt-4">Cargando detalles...</div>
        ) : provider ? (
          <div className="space-y-4 px-4">
            {/* Descripción del proveedor */}
            <div className="pl-2">
              <p className="text-sm text-gray-600">Descripción:</p>
              <p className="font-medium">{provider.description}</p>
            </div>

            {/* Información de contacto */}
            <div className="border rounded-lg p-3 pl-2">
              <p className="text-sm text-gray-600">Contacto:</p>
              {/* Teléfono del proveedor */}
              <div className="mt-2 flex items-center space-x-3">
                <Phone size={20} className="text-black-600" />
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="text-base">{provider.phoneNumber}</p>
                </div>
              </div>
              {/* RUC del proveedor */}
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
          <div className="text-center text-red-500 mt-4">
            No se pudieron cargar los detalles del proveedor
          </div> 
        )}
      </div>
    </div>
  );
};