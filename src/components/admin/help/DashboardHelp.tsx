import HelpCard from "./HelpCard";
import { HomeIcon } from "lucide-react";

const dashboardQuestions = [
  {
    id: "dashboard1",
    question: "¿Qué datos generales muestra el dashboard?",
    answer:
      "El dashboard muestra el total facturado, la cantidad de facturas emitidas y el número de citas agendadas.",
  },
  {
    id: "dashboard2",
    question:
      "¿Qué información contiene el gráfico de 'Distribución por tipo de factura'?",
    answer:
      "Muestra la cantidad de facturas emitidas según el tipo: contado o crédito.",
  },
  {
    id: "dashboard3",
    question: "¿Qué representa el gráfico de ingresos mensuales?",
    answer:
      "Este gráfico muestra los ingresos obtenidos por mes, permitiendo visualizar la evolución del monto facturado a lo largo del tiempo.",
  },
  {
    id: "dashboard4",
    question: "¿Qué indica el gráfico de 'Citas por mes'?",
    answer:
      "Refleja la cantidad de citas agendadas en cada mes, facilitando el seguimiento de la actividad mensual.",
  },
];

function normalize(text: string | undefined | null): string {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function DashboardHelp({ searchTerm }: { searchTerm: string }) {
  const normalizedSearch = normalize(searchTerm);

  const filter = (q: { question: string; answer: string }) =>
    normalize(q.question).includes(normalizedSearch) ||
    normalize(q.answer).includes(normalizedSearch);

  const filteredQuestions = dashboardQuestions.filter(filter);

  if (filteredQuestions.length === 0) return null;

  const isSingle = filteredQuestions.length > 0;

  return (
    <div
      className={`grid ${isSingle ? "" : "grid-cols-1 md:grid-cols-2"} gap-6`}
    >
      <HelpCard
        icon={<HomeIcon />}
        title="Dashboard"
        description="Vista general del sistema y métricas clave"
        questions={filteredQuestions}
        isSingle={isSingle}
      />
    </div>
  );
}
