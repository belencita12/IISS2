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
import ProductDetailSkeleton from "./skeleton/ProductDetailSkeleton";
import { useTranslations } from "next-intl";

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


  const b = useTranslations("Button");
  const m = useTranslations("ModalConfirmation");
  const e = useTranslations("Error");
  const s = useTranslations("Success");
  const p = useTranslations("ProductDetail");

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
      } catch (err: unknown) {
        toast("error", err instanceof Error ? err.message : e("noGetData"));
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
      toast("error", error?.message || e("noDelete", {field: "producto"}));
    } else {
      toast("success", s("successDelete", {field: "Producto"}));
      router.back();
    }
    setIsDeleteModalOpen(false);
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product)
    return <div className="text-center mt-8">{e("notFound")}</div>;

  // URL por defecto si no hay imagen
  const defaultImageSrc = "/NotImageNicoPets.png";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4 flex justify-start">
          <div className="relative w-[300px] h-[300px]">
            <Image
              src={product.image?.originalUrl || defaultImageSrc}
              alt={product.name}
              fill
              className="object-contain rounded-md"
              priority
            />
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col space-y-4 pl-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <ProductInfo product={product} isStockLoading={isLoading} />
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-6">
        <Button
          variant="outline"
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-6"
        >
          {b("delete")}
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/products/update/${product.id}`)
          }
          className="px-6"
        >
          {b("edit")}
        </Button>
      </div>

      <hr className="my-8 border-t border-gray-200" />

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-center mb-4">
          {p("quantityDeposit")}
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
        title={m("titleDelete", {field: "producto"})}
        message={m("deleteMessage", {field: product.name})}
        confirmText={b("delete")}
        cancelText={b("cancel")}
        variant="danger"
      />
    </div>
  );
}
