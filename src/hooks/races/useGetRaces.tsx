import { useQuery } from "../useQuery";
import { PaginationResponse, UseGetParams } from "@/lib/types";
import { useEffect, useState } from "react";
import { Race, RacesQueryParams } from "@/lib/pets/IPet";
import { getAllRaces } from "@/lib/pets/getRaces";

export const useGetRaces = ({
  init,
  token,
  condition,
}: UseGetParams<RacesQueryParams>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginationResponse<Race> | null>(null);

  const { query, setQuery, toQueryString } = useQuery(init);

  useEffect(() => {
    if (!condition) return;
    setIsLoading(true);
    const fetchSpecies = async () => {
      try {
        const queryStr = toQueryString();
        const res = await getAllRaces(token, queryStr);
        setData(res);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("Error al obtener las especies");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpecies();
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
