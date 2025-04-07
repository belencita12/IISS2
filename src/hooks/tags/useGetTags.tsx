import { Tag, TagQueryParams } from "@/lib/tags/types";
import { useQuery } from "../useQuery";
import { PaginationResponse } from "@/lib/types";
import { useEffect, useState } from "react";
import { getAllTags } from "@/lib/tags/service";
import useDebounce from "@/hooks/useDebounce";

export type UseGetTags = {
  init?: TagQueryParams;
  token: string;
  debounceDelay?: number;
};

export const useGetTags = ({ init, token, debounceDelay = 500 }: UseGetTags) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginationResponse<Tag> | null>(null);

  const { query, setQuery, toQueryString } = useQuery(init);
  
  // Aplicamos el debounce al query para evitar múltiples llamadas
  const debouncedQuery = useDebounce(query, debounceDelay);

  useEffect(() => {
    setIsLoading(true);
    const fetchTags = async () => {
      try {
        const queryStr = toQueryString();
        const res = await getAllTags(token, queryStr);
        setData(res);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("Error al obtener los tags");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTags();
  }, [debouncedQuery, token]);

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