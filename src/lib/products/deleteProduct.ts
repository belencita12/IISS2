import { PRODUCT_API } from "@/lib/urls";

export const deleteProduct = async (id: string, token: string) => {
  try {
    const response = await fetch(`${PRODUCT_API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al eliminar el producto");
    }
    return true;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error al eliminar el producto"
    );
  }
};
