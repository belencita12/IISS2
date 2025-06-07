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

  const t = useTranslations();

  useEffect(() => {
    if (!loading && !toastShown && (!purchaseDetails || purchaseDetails.length === 0)) {
      toast("warning", t("error.notFound"));
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
    <div className="relative min-h-screen px-2 sm:px-4">
      <div className="relative my-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/purchases')}
            className="border-black border-solid w-fit"
          >
            {t("button.toReturn")}
          </Button>
          
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
            {t("purchase.details.title")}
          </h1>
        </div>
      </div>

      {purchaseDetails && purchaseDetails.length > 0 && (
        <>
          <div className="relative mb-4">
            <PurchaseProviderCard 
              providerName={purchaseInfo?.provider?.businessName}
              total={purchaseInfo?.total}
              ivaTotal={purchaseInfo?.ivaTotal}
              date={purchaseInfo?.date}
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 sm:gap-x-8 lg:gap-x-14 gap-y-2 justify-items-center">
        {purchaseDetails && purchaseDetails.map(detail => (
          <PurchaseDetailCard key={detail.id} detail={detail} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-6">
          <GenericPagination
            handlePreviousPage={handlePreviousPage}
            handlePageChange={handlePageChange}
            handleNextPage={handleNextPage}
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default PurchaseDetail;