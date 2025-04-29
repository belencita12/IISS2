"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/products/getProductById";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import { getStocks } from "@/lib/stock/getStock";
import type { Product } from "@/lib/products/IProducts";
import type { StockDetailsData, StockData } from "@/lib/stock/IStock";
import ProductInfo from "@/components/admin/product/ProductInfo";
import StockList from "@/components/admin/product/ProductStockList";
import { toast } from "@/lib/toast";
import { useFetch } from "@/hooks/api/useFetch";
import { PRODUCT_API } from "@/lib/urls";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";

interface ProductDetailProps {
  token: string;
}

export default function ProductDetail({ token }: ProductDetailProps) {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [stockDetails, setStockDetails] = useState<StockDetailsData[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { delete: deleteReq, loading: isDelLoading } = useFetch<void, null>(
    PRODUCT_API,
    token,
    { method: "DELETE" }
  );

  useEffect(() => {
    if (!id || id === "create") {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [productData, stockResponse, stocksResponse] = await Promise.all([
          getProductById(id as string, token),
          getStockDetails(id as string, token),
          getStocks({ page: 1, size: 100 }, token),
        ]);
        setProduct(productData);
        setStockDetails(stockResponse.data);
        setStocks(stocksResponse.data);
      } catch (err) {
        toast("error", "No se pudo cargar la información del producto");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleConfirmDelete = async () => {
    if (!id) return;

    const { ok, error } = await deleteReq(null, `${PRODUCT_API}/${id}`);

    if (!ok) {
      toast("error", error?.message || "Error al eliminar el producto");
    } else {
      toast("success", "Producto eliminado correctamente");
      router.push("/dashboard/products");
    }
    setIsDeleteModalOpen(false);
  };

  if (isLoading) return <div className="text-center mt-8">Cargando...</div>;
  if (!product)
    return <div className="text-center mt-8">Producto no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 flex justify-center items-start">
          <div className="relative w-[300px] h-[300px]">
            <Image
              src={product.image?.originalUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain rounded-md"
              priority
            />
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.code}</p>
          </div>

          <ProductInfo
            product={product}
            stockDetails={stockDetails}
            isStockLoading={isLoading}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6 justify-center">
        <Button
          variant="outline"
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-6"
        >
          Eliminar
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/products/update/${product.id}`)
          }
          className="px-6"
        >
          Editar
        </Button>
      </div>

      <hr className="my-6 border-t border-gray-200" />

      <div className="mt-4">
        <h3 className="text-2xl font-semibold text-center mb-6">
          Cantidad por Sucursales
        </h3>
        <StockList
          stockDetails={stockDetails}
          stocks={stocks}
          isLoading={isLoading}
        />
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        isLoading={isDelLoading}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar"
        message={`¿Seguro que quieres eliminar el producto ${product.name}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
