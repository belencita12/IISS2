import { WORK_POSITION_API } from "../urls";
import { useFetch } from "@/hooks/api/useFetch";

export interface WorkPosition {
  id: number;
  name: string;
}

export function useWorkPositionById(token: string, id: string | number) {
  const { data, loading, error, execute } = useFetch<WorkPosition>(
    `${WORK_POSITION_API}/${id}`,
    token,
    { immediate: true, method: "GET" }
  );

  return { workPosition: data, loading, error, refetch: execute };
}