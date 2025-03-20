"use client";

interface DepositDetail {
  id: number;
  id_producto: number;
  id_deposito: number;
  cantidad: number;
}

interface DepositDetailsProps {
  depositoId: number;
  depositDetails: DepositDetail[];
}

export default function DepositDetails({ depositoId, depositDetails }: DepositDetailsProps) {
  const detallesFiltrados = depositDetails.filter((item) => item.id_deposito === depositoId);

  return (
    <div>
      <h2 className="text-lg font-semibold">Detalles del Depósito</h2>
      <ul>
        {detallesFiltrados.length > 0 ? (
          detallesFiltrados.map((detalle) => (
            <li key={detalle.id}>
              Producto ID: {detalle.id_producto} - Cantidad: {detalle.cantidad}
            </li>
          ))
        ) : (
          <p>No hay productos en este depósito.</p>
        )}
      </ul>
    </div>
  );
}
