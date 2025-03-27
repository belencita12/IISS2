import React, { useState, useEffect } from "react"; 
import { X, Phone, Building2 } from "lucide-react"; 
import { Provider } from "@/lib/provider/IProvider"; 
import { getProviderById } from "@/lib/provider/getProviderById"; 

// Definición de las propiedades que el componente espera recibir
interface ProviderDetailContentProps {   
  token: string; 
  isOpen: boolean; 
  onClose: () => void; 
  providerId: number | null; 
}  

// Componente que muestra los detalles de un proveedor dentro del modal
export const ProviderDetail: React.FC<ProviderDetailContentProps> = ({   
  token,   
  isOpen,   
  onClose,   
  providerId 
}) => {   
  const [provider, setProvider] = useState<Provider | null>(null); 
  const [isLoading, setIsLoading] = useState(false); 

  // Efecto que se ejecuta cuando el modal se abre o cambia el ID del proveedor
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
        {/* Botón de cierre (X)*/}
        <button
          onClick={onClose}
          className="absolute bottom-8 right-1 text-gray-600 hover:text-gray-800"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        {isLoading ? (
          // Título para el estado de carga
          <h2 className="text-sm text-gray-600 mt-4">
            Cargando detalles del proveedor...
          </h2>
        ) : (
          // Título para cuando se cargan los datos
          <h2 className="text-xl font-bold mt-4">
            {provider?.businessName || "Detalles del Proveedor"}
          </h2>
        )}
      </div>
      
      {/* Línea divisoria debajo del título */}       
      <div className="border-t border-gray-300 mt-1 w-full"></div>  

      {/* Contenido del proveedor o mensaje de error si no se encontraron datos */}       
      {!isLoading && provider ? (         
        <div className="space-y-4">           
          <div className="pl-2">             
            <p className="text-sm text-gray-600">Descripción:</p>             
            <p className="font-medium">{provider.description}</p>           
          </div>  

          {/* Sección con los datos de contacto */}           
          <div className="border rounded-lg p-2 pl-2">             
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
              <Building2 size={20} className="text-black-600" />               
              <div>                 
                <p className="text-xs text-gray-500">RUC</p>                 
                <p className="text-base">{provider.ruc}</p>               
              </div>             
            </div>           
          </div>         
        </div>       
      ) : (         
        // Muestra un mensaje de error si la carga finalizó y no se obtuvieron datos       
        !isLoading && <div className="text-center text-red-500 mt-4">No se pudieron cargar los detalles del proveedor</div>       
      )}     
    </div>   
  ); 
};
