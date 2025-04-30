import { useState, useCallback } from "react";
import { useQuery } from "../useQuery";
import { usePaginatedFetch } from "../api/usePaginatedFetch";
import { toast } from "@/lib/toast";

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  tags: string[];
  image?: {
    id: number;
    previewUrl: string;
    originalUrl: string;
  };
}

export const useServiceTypeList = (token: string) => {
  const { data, loading, error, pagination, setPage, search } = usePaginatedFetch<ServiceType>(
    "/api/service-types",
    token,
    {
      initialPage: 1,
      autoFetch: true,
    }
  );

  const handleSearch = useCallback((query: string) => {
    search({ search: query });
  }, [search]);

  return {
    serviceTypes: data,
    isLoading: loading,
    error,
    pagination,
    onPageChange: setPage,
    onSearch: handleSearch,
  };
}; 