"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPurchaseById } from "@/lib/purchases/getPurchaseDetailById";
import PurchaseDetailCard from "@/components/admin/purchases/detailCard/PurchaseProductCard";
import PurchaseProviderCard from "@/components/admin/purchases/detailCard/PurchaseProviderCard";
import { Purchase } from "@/lib/purchases/IPurchase";
import { toast } from "@/lib/toast";
import GenericPagination from "@/components/global/GenericPagination";
import { usePurchaseDetail } from "@/hooks/purchases/usePurchaseDetail";

interface PurchaseDetailProps {
  token: string;
  initialPage?: number;
}

const PurchaseDetail: React.FC<PurchaseDetailProps> = ({ token, initialPage = 1 }) => {
  const { id } = useParams(); 
  const [purchaseInfo, setPurchaseInfo] = useState<Purchase | null>(null); 
  const [page, setPage] = useState<number>(initialPage); 
  
  const { data: purchaseDetails, totalPages, loading, error } = usePurchaseDetail(id as string, token, page);

  // `useEffect` que obtiene la información de la compra inicial al cargar el componente
  useEffect(() => {
    if (!id) return; 
    const fetchPurchaseInfo = async () => {
      try {
        const purchaseData = await getPurchaseById(id as string, token);
        setPurchaseInfo(purchaseData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "No se pudo cargar la información de la compra"; 
        toast("error", errorMessage); 
      }
    };

    fetchPurchaseInfo(); 
  }, [id, token]);

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
      
      {/* Muestra los datos del proveedor que realizó la compra y datos resumidos de la compra*/}
      <PurchaseProviderCard
        providerName={purchaseInfo?.provider?.businessName}
        total={purchaseInfo?.total}
        ivaTotal={purchaseInfo?.ivaTotal}
        date={purchaseInfo?.date}
      />

      {/* Muestra los productos de la compra */}
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
