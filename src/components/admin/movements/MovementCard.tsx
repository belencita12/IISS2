import { Card } from "@/components/global/Card";
import { MovementData } from "@/lib/movements/IMovements";

export default function MovementCard({ movement }: { movement: MovementData }) {
  const fecha = new Date(movement.dateMovement).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Card
      title={movement.type === "INBOUND" ? "Transferencia" : "Vencimiento de Productos"}
      description={`Deposito Origen: ${movement.originStock?.name || "—"}\nDeposito Destino: ${movement.destinationStock?.name || "—"}`}
      image="/images/movimiento.jpg"
      alt="Movimiento"
      layout="horizontal"
      imagePosition="left"
      bgColor="bg-white"
      textColor="text-black"
      showButton={false}
    >
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span><strong>{movement.manager?.fullName ?? "Encargado desconocido"} - {movement.manager?.ruc ?? "—"}</strong></span>
        <span>{fecha}</span>
      </div>
      <p className="mt-2 text-sm text-gray-700">{movement.description}</p>
    </Card>
  );
}
