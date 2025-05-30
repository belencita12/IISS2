import { useState } from "react";
import { Stamped, StampedQueryParams } from "@/lib/stamped/IStamped";
import { api } from "@/lib/api";
import { PaginatedResponse } from "@/lib/types";

export const useStampedList = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getStampedList = async (params: StampedQueryParams): Promise<PaginatedResponse<Stamped>> => {
    try {
      const response = await api.get<PaginatedResponse<Stamped>>("/stamped", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getStampedList,
    isLoading,
  };
}; 