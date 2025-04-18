"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/products/getProductById";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import { getStocks } from "@/lib/stock/getStock";
import { Product } from "@/lib/products/IProducts";
import { StockDetailsData, StockData } from "@/lib/stock/IStock";
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

  // Hook useFetch para DELETE
  const { delete: deleteReq, loading: isDelLoading } = useFetch<void, null>(
    PRODUCT_API,
    token,
    { method: 'DELETE' }
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

    const { ok, error } = await deleteReq(
      null,
      `${PRODUCT_API}/${id}`
    );

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
      <div className="flex flex-col md:flex-row justify-center items-start">
        <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
          {product.image?.originalUrl ? (
            <Image
              src={product.image.originalUrl}
              alt={product.name}
              width={260}
              height={260}
              className="object-contain"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-4xl font-bold">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 md:pl-6 self-start mt-3">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <ProductInfo
            product={product}
            stockDetails={stockDetails}
            isStockLoading={isLoading}
          />
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
        </div>
      </div>

      <div className="mt-10 w-full">
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
        title="¿Estás seguro de eliminar este producto?"
        message={`Se eliminará "${product.name}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
