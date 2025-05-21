import { useState, useCallback, useEffect } from "react";
import { usePaginatedFetch } from "../api/usePaginatedFetch";
import { SERVICE_TYPE } from "@/lib/urls";

export interface ServiceType {
  id: number;
  slug: string;
  name: string;
  description: string;
  durationMin: number;
  iva: number;
  price: number;
  cost: number;
  maxColabs?: number;
  isPublic?: boolean;
  tags?: string[];
  img?: {
    id: number;
    previewUrl: string;
    originalUrl: string;
  };
}

export const useServiceTypeList = (token: string) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  const { data, loading, error, pagination, setPage, search } = usePaginatedFetch<ServiceType>(
    SERVICE_TYPE,
    token,
    {
      initialPage: 1,
      autoFetch: true,
      extraParams: { size : 10000 }
    }
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    search({});
  }, [search]);

  useEffect(() => {
    if (data) {
      console.log("Data fetched:", data);
      setServiceTypes(data.filter(serviceType => {
        const nameMatch = serviceType.name.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch;
      }));
    }
  }
  , [data]);

  return {
    serviceTypes,
    isLoading: loading,
    error,
    pagination,
    onPageChange: setPage,
    onSearch: handleSearch,
    searchQuery
  };
}; 
