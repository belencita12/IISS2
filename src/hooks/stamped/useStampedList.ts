import { useState } from "react";
import { Stamped, StampedQueryParams } from "@/lib/stamped/IStamped";
import { STAMPED_API } from "@/lib/urls";
import { PaginationResponse } from "@/lib/types";
import { apiFetch } from "@/lib/api/apiFetch";

export const useStampedList = (token: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const getStampedList = async (params: StampedQueryParams): Promise<PaginationResponse<Stamped>> => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.size) queryParams.append('size', params.size.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      if (params.fromNum) queryParams.append('fromNum', params.fromNum.toString());
      if (params.toNum) queryParams.append('toNum', params.toNum.toString());
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

      const response = await apiFetch<PaginationResponse<Stamped>>(`${STAMPED_API}?${queryParams.toString()}`, token);
      if (!response.data) {
        throw new Error("No se pudo obtener la lista de timbrados");
      }
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getStampedList,
    isLoading,
  };
};