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

  const t = useTranslations();


  if (loading) return <MovementDetailSkeleton/>;
  if (error) return <p className="text-center text-red-500 mt-10">{t("error.error")}: {error}</p>;
  if (!movement) return <p className="text-center mt-10">{t("error.notFound")}</p>;

  const handleRevert = async () => {
    try {
      setIsReverting(true);
      await revertMovement(id, token);
      toast('success', t("success.successRevertMovement"));
      router.push("/dashboard/movement");
    } catch (error: unknown) {
      if (error instanceof Error) toast('error', error.message);
    } finally {
      setIsReverting(false);
      setIsRevertModalOpen(false);
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case "INBOUND":
        return t("movement.type.inbound");
      case "OUTBOUND":
        return t("movement.type.outbound");
      case "TRANSFER":
        return t("movement.type.transfer");
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6 mt-2">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/movement')}
          className="border-black border-solid"
        >
          {t("button.toReturn")}
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("movement.details.movementOf", {movement : getMovementTypeLabel(movement.type) })} 
        </h1>
        <p className="text-base md:text-lg font-semibold text-black">
          {formatDate(movement.dateMovement)}
        </p>
      </div>

      <Card className="p-6 mb-6 shadow-sm space-y-4">
        <InfoRow label={t("movement.details.employee")} value={movement.manager?.fullName} />
        {movement.originStock?.name && <InfoRow label={t("movement.details.originStock")} value={movement.originStock.name} />}
        {movement.destinationStock?.name && <InfoRow label={t("movement.details.destinationStock")} value={movement.destinationStock.name} />}
        {movement.description && (
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 mb-1">{t("movement.details.description")}</p>
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
                  {isReverting ? t("button.reversing") :t("button.revert")}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-700">{t("movement.details.productsTitle")}</h2>
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
        title={t("confirmationModal.movement.titleRevert")}
        message={t("confirmationModal.movement.messageRevert")}
        confirmText={t("button.revert")}
        cancelText={t("button.cancel")}
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

