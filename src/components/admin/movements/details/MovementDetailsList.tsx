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

interface Props {
  id: number;
  token: string;
}

export const MovementDetailsList = ({ id, token }: Props) => {
  const { movement, details, loading, error, pagination, setQuery } = useMovementDetails(id, token);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const router = useRouter();

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  if (!movement) return <p className="text-center mt-10">No se encontró el movimiento.</p>;

  const handleRevert = async () => {
    try {
      setIsReverting(true);
      await revertMovement(id, token);
      toast.success('Movimiento revertido exitosamente');
      router.push("/dashboard/movement");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al revertir el movimiento');
    } finally {
      setIsReverting(false);
      setIsRevertModalOpen(false);
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case "INBOUND":
        return "Ingreso";
      case "OUTBOUND":
        return "Egreso";
      case "TRANSFER":
        return "Transferencia";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Movimiento de {getMovementTypeLabel(movement.type)}
        </h1>
        <p className="text-base md:text-lg font-semibold text-black">
          {formatDate(movement.dateMovement)}
        </p>
      </div>

      <Card className="p-6 mb-6 shadow-sm space-y-4">
        <InfoRow label="Encargado" value={movement.manager?.fullName} />
        {movement.originStock?.name && <InfoRow label="Depósito Origen" value={movement.originStock.name} />}
        {movement.destinationStock?.name && <InfoRow label="Depósito Destino" value={movement.destinationStock.name} />}
        {movement.description && (
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 mb-1">Descripción</p>
            <p className="bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 w-full break-words">
              {movement.description}
            </p>
            {movement.type === "TRANSFER" && (
              <div className="mt-4">
                <Button
                  variant="default"
                  onClick={() => setIsRevertModalOpen(true)}
                  disabled={isReverting}
                  className="border-none"
                >
                  {isReverting ? "Revirtiendo..." : "Revertir"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>



      <h2 className="text-xl font-semibold mb-2 text-gray-700">Productos</h2>
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
        title="Revertir Movimiento"
        message="¿Estás seguro que deseas revertir este movimiento? Esta acción creará un nuevo movimiento en sentido contrario."
        confirmText="Sí, revertir"
        cancelText="Cancelar"
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

