import { EMPLOYEE_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api/useFetch";

export function useUpdateEmployee(token: string) {
  const { loading, error, execute } = useFetch<unknown, FormData>(
    "", // La URL se pasa en el execute
    token,
    { method: "PATCH" }
  );

  const updateEmployee = async (id: number, formData: FormData) => {
    const url = `${EMPLOYEE_API}/${id}`;
    return await execute(formData, url, "PATCH");
  };

  return { updateEmployee, loading, error };
}