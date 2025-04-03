import { useQuery } from "../useQuery";
import { PaginationResponse } from "@/lib/types";
import { useEffect, useState } from "react";
import { Species, SpeciesQueryParams } from "@/lib/pets/IPet";
import { getAllSpecies } from "@/lib/pets/getRacesAndSpecies";

export type UseGetSpecies = {
  init?: SpeciesQueryParams;
  token: string;
};

export const useGetSpecies = ({ init, token }: UseGetSpecies) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginationResponse<Species> | null>(null);

  const { query, setQuery, toQueryString } = useQuery(init);

  useEffect(() => {
    setIsLoading(true);
    const fetchSpecies = async () => {
      try {
        const queryStr = toQueryString();
        const res = await getAllSpecies(token, queryStr);
        setData(res);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("Error al obtener las especies");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpecies();
  }, [query, toQueryString, token]);

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
