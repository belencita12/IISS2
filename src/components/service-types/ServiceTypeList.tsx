import React, { useState } from 'react';
import { ServiceType, deleteServiceType } from '@/lib/service-types/service';
import { useServiceTypeList } from '@/hooks/service-types/useServiceTypeList';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

const ServiceTypeList: React.FC = () => {
  const [token, setToken] = useState('');

  const { serviceTypes, isLoading, error, onPageChange, onSearch } = useServiceTypeList(token);

  const handleDelete = async (serviceType: ServiceType) => {
    try {
      await deleteServiceType(token, serviceType.id);
      toast("success", "Tipo de servicio eliminado correctamente");
      onPageChange(1);
    } catch (error) {
      toast("error", "Error al eliminar el tipo de servicio");
    }
  };

  return (
    <div className="space-y-4">
      {serviceTypes?.map((serviceType) => (
        <div key={serviceType.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{serviceType.name}</h3>
            <p className="text-sm text-gray-500">{serviceType.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDelete(serviceType)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceTypeList; 