import { deleteTag } from "@/lib/tags/service";
import { toast } from "@/lib/toast";
import { useState } from "react";

export type UseDelTags = {
  token: string;
};

export const useDelTag = ({ token }: UseDelTags) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const delTag = async (id: number) => {
    try {
      await deleteTag(token, id);
      toast("success", "Etiqueta eliminada con éxito");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Error al eliminar el tag");
      toast("error", "Error al eliminar el tags");
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
