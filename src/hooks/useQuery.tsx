import { BaseQueryParams } from "@/lib/types";
import { useCallback, useState } from "react";

export const useQuery = <T extends BaseQueryParams>(init?: T) => {
  const [query, setQuery] = useState<T>(init || ({ page: 1 } as T));

  const toQueryString = useCallback(() => {
    const url = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) url.set(key, value.toISOString());
        else url.set(key, String(value));
      }
    });
    return url.toString();
  }, [query]);

  return { query, setQuery, toQueryString };
};
