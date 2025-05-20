"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PurchaseDetailCard from "@/components/admin/purchases/detailCard/PurchaseProductCard";
import PurchaseProviderCard from "@/components/admin/purchases/detailCard/PurchaseProviderCard";
import { PurchaseData } from "@/lib/purchases/IPurchase";
import { toast } from "@/lib/toast";
import GenericPagination from "@/components/global/GenericPagination";
import { usePurchaseDetail } from "@/hooks/purchases/usePurchaseDetail";
import PurchaseDetailSkeleton from "./skeleton/PurchaseDetailSkeleton";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface PurchaseDetailProps {
  token: string;
  purchaseInfo: PurchaseData;
  initialPage?: number;
}

const PurchaseDetail: React.FC<PurchaseDetailProps> = ({ token, purchaseInfo, initialPage = 1 }) => {
  const { id } = useParams();
  const router = useRouter();
  const [page, setPage] = useState<number>(initialPage);
  const [toastShown, setToastShown] = useState<boolean>(false);
  
  const { data: purchaseDetails, totalPages, loading, error } = usePurchaseDetail(id as string, token, page);

  const p = useTranslations("PurchaseDetail");
  const e = useTranslations("Error");
  const b = useTranslations("Button");

  useEffect(() => {
    if (!loading && !toastShown && (!purchaseDetails || purchaseDetails.length === 0)) {
      toast("warning", e("notFound"));
      setToastShown(true);
    }
  }, [purchaseDetails, toastShown, loading]);

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  if (loading) return <PurchaseDetailSkeleton />;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative min-h-screen">
    
      {purchaseDetails && purchaseDetails.length > 0 && (
        <>
          <h1 className="text-3xl font-bold text-center mt-4 mb-2">{p("titleDetail")}</h1>
          {/* Muestra los datos del proveedor que realizó la compra y datos resumidos de la compra */}
          <div className="relative">
            <PurchaseProviderCard 
              providerName={purchaseInfo?.provider?.businessName}
              total={purchaseInfo?.total}
              ivaTotal={purchaseInfo?.ivaTotal}
              date={purchaseInfo?.date}
            />
            <div className="absolute bottom-4 right-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/purchases')}
                className="px-6 border-gray-200 border-solid"
              >
                {b("toReturn")}
              </Button>
            </div>
          </div>
        </>
      )}
      
      {/* Muestra los productos de la compra */}
      {purchaseDetails && purchaseDetails.map(detail => (
        <PurchaseDetailCard key={detail.id} detail={detail} />
      ))}
      
      {totalPages > 1 && (
        <GenericPagination
          handlePreviousPage={handlePreviousPage}
          handlePageChange={handlePageChange}
          handleNextPage={handleNextPage}
          currentPage={page}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default PurchaseDetail;