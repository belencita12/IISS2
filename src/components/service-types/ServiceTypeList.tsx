import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { ServiceType } from '../../types/ServiceType';
import { deleteServiceType } from '../../services/serviceTypeService';

const ServiceTypeList: React.FC = () => {
  const [token, setToken] = useState('');

  const { data: serviceTypes, refetch } = useQuery<ServiceType[]>('serviceTypes', () => {
    // Implementation of the query
  });

  const { mutate } = useMutation(async (serviceType: ServiceType) => {
    try {
      await deleteServiceType(token, serviceType.id);
      toast.success("Tipo de servicio eliminado correctamente");
      refetch();
    } catch (error) {
      console.error("Error al eliminar el tipo de servicio:", error);
      toast.error("Error al eliminar el tipo de servicio");
    }
  });

  const handleDelete = async (serviceType: ServiceType) => {
    try {
      await deleteServiceType(token, serviceType.id);
      toast.success("Tipo de servicio eliminado correctamente");
      refetch();
    } catch (error) {
      console.error("Error al eliminar el tipo de servicio:", error);
      toast.error("Error al eliminar el tipo de servicio");
    }
  };

  return (
    <div>
      {/* Render your service types here */}
    </div>
  );
};

export default ServiceTypeList; 