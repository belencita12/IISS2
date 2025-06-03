import { Stamped, StampedQueryParams } from "@/lib/stamped/IStamped";
import { useQuery } from "../useQuery";
import { PaginationResponse, UseGetParams } from "@/lib/types";
import { useEffect, useState } from "react";
import { getAllStamped } from "@/lib/stamped/getStamped";


interface UseGetStampedReturn {
    isLoading: boolean;
    error: string | null;
    data: PaginationResponse<Stamped> | null;
    query: StampedQueryParams;
    setData: React.Dispatch<React.SetStateAction<PaginationResponse<Stamped> | null>>;
    setQuery: React.Dispatch<React.SetStateAction<StampedQueryParams>>;
    toQueryString: () => string;
    onPageChange: (page: number) => void;
}

export const useGetStamped = ({
    init,
    token,
    condition,
}: UseGetParams<StampedQueryParams>): UseGetStampedReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginationResponse<Stamped> | null>(null);
  const { query, setQuery, toQueryString } = useQuery(init);

  useEffect(() => {
    if (!condition) return;
    setIsLoading(true);
    const fetchStamped = async () => {
      try {
        const queryStr = toQueryString();
        const res = await getAllStamped(token, queryStr);
        setData(res);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("Error al obtener los timbrados");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStamped();
  }, [query, toQueryString, condition, token]);

  const onPageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  return {
    isLoading,
    error,
    data,
    query,
    setData,
    setQuery,
    toQueryString,
    onPageChange,
  };
}; 