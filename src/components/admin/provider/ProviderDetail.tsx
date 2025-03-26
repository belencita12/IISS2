"use client";
import React, { useState, useEffect } from "react";
import { X, Phone, FileText } from 'lucide-react';
import { Provider } from "@/lib/provider/IProvider";
import { getProviderById } from "@/lib/provider/getProviderById";

interface ProviderDetailProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  providerId: number | null;
}

export const ProviderDetail: React.FC<ProviderDetailProps> = ({
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-lg relative">
        {/* Botón de cierre en la esquina superior derecha con X más pequeña */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        {/* Encabezado del modal con padding superior para separar del botón de cierre */}
        <div className="p-4 pt-10 border-b">
          <h2 className="text-xl font-bold text-center">
            {isLoading ? "Cargando..." : provider?.businessName || "Detalles del Proveedor"}
          </h2>
        </div>

        {/* Contenido del modal */}
        {isLoading ? (
          <div className="p-6 text-center">Cargando detalles...</div>
        ) : provider ? (
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600">Descripción:</p>
              <p className="font-medium">{provider.description}</p>
            </div>

            <div>
              <div className="border rounded-lg p-2">
                <p className="text-sm text-gray-600 mb-4">Contacto:</p>
                <div className="flex items-center space-x-4">
                  <Phone size={22} className="text-black-600" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-base">{provider.phoneNumber}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                  <FileText size={22} className="text-black-600" />
                  <div>
                    <p className="text-xs text-gray-500">RUC</p>
                    <p className="text-base">{provider.ruc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-red-500">
            No se pudieron cargar los detalles del proveedor
          </div>
        )}
      </div>
    </div>
  );
};
