"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPurchaseDetailByPurchaseId } from "@/lib/purchases/getPurchaseDetailByPurchaseId";
import { getPurchaseById } from "@/lib/purchases/getPurchaseDetailById";
import PurchaseDetailCard from "@/components/admin/purchases/detailsCards/PurchaseProductCard";
import PurchaseSummary from "@/components/admin/purchases/detailsCards/PurchaseProviderCard";
import { PurchaseDetail as IPurchaseDetail, PurchaseDetailResponse } from "@/lib/purchases/IPurchaseDetail";
import { Purchase } from "@/lib/purchases/IPurchase";
import { toast } from "@/lib/toast";
import GenericPagination from "@/components/global/GenericPagination";

interface PurchaseDetailProps {
  token: string;
  initialPage?: number;
}

const PurchaseDetail: React.FC<PurchaseDetailProps> = ({ token, initialPage = 1 }) => {
  const { id } = useParams();
  const [purchaseDetails, setPurchaseDetails] = useState<IPurchaseDetail[] | null>(null);
  const [purchaseInfo, setPurchaseInfo] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const purchaseData = await getPurchaseById(id as string, token);
        setPurchaseInfo(purchaseData);

        const detailsData: PurchaseDetailResponse = await getPurchaseDetailByPurchaseId(id as string, page, token);
        
        if (detailsData) {
          setPurchaseDetails(detailsData.data);
          setTotalPages(detailsData.totalPages);
        } else {
          throw new Error("La respuesta no contiene datos válidos.");
        }
      } catch (err) {
        setError("No se pudo cargar la información de la compra");
        toast("error", "No se pudo cargar la información de la compra");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, page]);

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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!purchaseDetails || purchaseDetails.length === 0) return <p>No se encontraron detalles de la compra.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-4 mb-2">Compra Detalles</h1>
      
      <PurchaseSummary
        providerName={purchaseInfo?.provider?.businessName}
        total={purchaseInfo?.total}
        ivaTotal={purchaseInfo?.ivaTotal}
        date={purchaseInfo?.date}
      />

      {purchaseDetails.map(detail => (
        <PurchaseDetailCard key={detail.id} detail={detail} />
      ))}

      <GenericPagination
        handlePreviousPage={handlePreviousPage}
        handlePageChange={handlePageChange}
        handleNextPage={handleNextPage}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
};

export default PurchaseDetail;
