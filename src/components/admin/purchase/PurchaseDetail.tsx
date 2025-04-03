"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPurchaseDetailById } from "@/lib/purchase/getPurchaseDetailById";
import PurchaseDetailCard from "@/components/admin/purchase/PurchaseDetailCard";
import { PurchaseDetail as IPurchaseDetail } from "@/lib/purchase/IPurchaseDetail";
import { toast } from "@/lib/toast";

interface PurchaseDetailProps {
  token: string;
}

const PurchaseDetail: React.FC<PurchaseDetailProps> = ({ token }) => {
  const { id } = useParams();
  const [purchaseDetail, setPurchaseDetail] = useState<IPurchaseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fixed: directly call getPurchaseDetailById instead of using the hook
        const detailData = await getPurchaseDetailById(id as string, token);
        setPurchaseDetail(detailData);
      } catch (err) {
        setError("No se pudo cargar la información de la compra");
        toast("error", "No se pudo cargar la información de la compra");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!purchaseDetail) return <p>No se encontraron detalles de la compra.</p>;

  return <PurchaseDetailCard detail={purchaseDetail} />;
};

export default PurchaseDetail;