import HelpCard from "./HelpCard";
import { HomeIcon } from "lucide-react";

const dashboardQuestions = [
  {
    id: "dashboard1",
    question: "¿Qué información muestra el panel principal?",
    answer:
      "El panel principal muestra métricas clave como citas del día, ingresos recientes y alertas importantes.",
  },
  {
    id: "dashboard2",
    question: "¿Cómo personalizo los widgets del dashboard?",
    answer:
      "Haz clic en el ícono de configuración del dashboard para seleccionar qué widgets mostrar.",
  },
  {
    id: "dashboard3",
    question: "¿Puedo ver un resumen mensual desde el dashboard?",
    answer:
      "Sí, en la parte superior puedes cambiar el rango de fechas para ver datos mensuales o personalizados.",
  },
];

function normalize(text: string | undefined | null): string {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .trim();
}

export default function DashboardHelp({
  searchTerm,
}: {
  searchTerm: string;
}) {
  const normalizedSearch = normalize(searchTerm);

  const filter = (q: { question: string; answer: string }) =>
    normalize(q.question).includes(normalizedSearch) ||
    normalize(q.answer).includes(normalizedSearch);

  const filteredQuestions = dashboardQuestions.filter(filter);

  if (filteredQuestions.length === 0) return null;

  return (
    <div>
      <HelpCard
        icon={< HomeIcon />}
        title="Dashboard"
        description="Vista general del sistema y métricas clave"
        questions={filteredQuestions}
      />
    </div>
  );
}
