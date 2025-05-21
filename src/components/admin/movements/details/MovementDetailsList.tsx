"use client";

import { useMovementDetails } from "@/hooks/movements/useMovementDetails";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import { formatDate } from "@/lib/utils";
import { MovementDetailCard } from "./MovementDetailCard";
import GenericPagination from "@/components/global/GenericPagination";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { useState } from "react";
import { revertMovement } from "@/lib/movements/revertMovement";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import MovementDetailSkeleton from "../skeleton/MovementDetailSkeleton";
import { useTranslations } from "next-intl";

interface Props {
  id: number;
  token: string;
}

export const MovementDetailsList = ({ id, token }: Props) => {
  const { movement, details, loading, error, pagination, setQuery } = useMovementDetails(id, token);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const router = useRouter();

  const m = useTranslations("MovementDetail");
  const e = useTranslations("Error");
  const b = useTranslations("Button");
  const mc = useTranslations("ModalConfirmation");
  const s = useTranslations("Success");


  if (loading) return <MovementDetailSkeleton/>;
  if (error) return <p className="text-center text-red-500 mt-10">{e("error")}: {error}</p>;
  if (!movement) return <p className="text-center mt-10">{e("notFound")}</p>;

  const handleRevert = async () => {
    try {
      setIsReverting(true);
      await revertMovement(id, token);
      toast('success', s("successRevert", {field: "Movimiento"}));
      router.push("/dashboard/movement");
    } catch (error) {
      toast('error', error instanceof Error ? error.message : e("errorRevert", {field : "movimiento"}));
    } finally {
      setIsReverting(false);
      setIsRevertModalOpen(false);
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case "INBOUND":
        return m("inbound");
      case "OUTBOUND":
        return m("outbound");
      case "TRANSFER":
        return m("transfer");
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/movement')}
          className="border-black border-solid"
        >
          {b("toReturn")}
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {m("movementOf")} {getMovementTypeLabel(movement.type)}
        </h1>
        <p className="text-base md:text-lg font-semibold text-black">
          {formatDate(movement.dateMovement)}
        </p>
      </div>

      <Card className="p-6 mb-6 shadow-sm space-y-4">
        <InfoRow label={m("employee")} value={movement.manager?.fullName} />
        {movement.originStock?.name && <InfoRow label={m("origin")} value={movement.originStock.name} />}
        {movement.destinationStock?.name && <InfoRow label={m("destination")} value={movement.destinationStock.name} />}
        {movement.description && (
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 mb-1">{m("description")}</p>
            <p className="bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 w-full break-words">
                {movement.description}
            </p>
            {movement.type === "TRANSFER" && movement.isReversible && (
              <div className="mt-4">
                <Button
                  variant="default"
                  onClick={() => setIsRevertModalOpen(true)}
                  disabled={isReverting}
                  className="border-none"
                >
                  {isReverting ? b("reversing") :b("revert")}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-700">{m("products")}</h2>
      </div>
      <Separator className="mb-4" />
      <div className="space-y-6">
        {details.map((detail, idx) => (
          <MovementDetailCard key={idx} detail={detail} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <GenericPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          handlePreviousPage={() =>
            setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
          }
          handleNextPage={() =>
            setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
          }
          handlePageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
        />
        </div>
      )}

      <ConfirmationModal
        isOpen={isRevertModalOpen}
        onClose={() => setIsRevertModalOpen(false)}
        onConfirm={handleRevert}
        title={mc("titleRevert", {field: "movimiento"})}
        message={mc("confirmRevert", {field: "movimiento"})}
        confirmText={b("revert")}
        cancelText={b("cancel")}
        variant="warning"
        isLoading={isReverting}
      />
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between items-center">
    <p className="text-sm text-gray-500 w-1/2">{label}</p>
    <p className="bg-gray-200 rounded-md px-3 py-1 text-sm text-right">{value || "N/A"}</p>
  </div>
);

