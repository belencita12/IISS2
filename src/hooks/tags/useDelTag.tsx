import { deleteTag } from "@/lib/tags/service";
import { toast } from "@/lib/toast";
import { useState } from "react";

export type UseDelTags = {
  token: string;
};

export const useDelTag = ({ token }: UseDelTags) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delTag = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteTag(token, id);
      toast("success", "Etiqueta eliminada con éxito");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Error al eliminar la etiqueta");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    delTag,
  };
};
