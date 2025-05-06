import { useState, useCallback } from "react";
import { usePaginatedFetch } from "../api/usePaginatedFetch";
import { SERVICE_TYPE_API } from "@/lib/urls";

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

  const { data, loading, error, pagination, setPage, search } = usePaginatedFetch<ServiceType>(
    SERVICE_TYPE_API,
    token,
    {
      initialPage: 1,
      autoFetch: true,
      extraParams: { search: "" }
    }
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    search({ search: query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    serviceTypes: data,
    isLoading: loading,
    error,
    pagination,
    onPageChange: setPage,
    onSearch: handleSearch,
    searchQuery
  };
}; 
