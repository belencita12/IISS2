import HelpCard from "./HelpCard";
import { UserIcon, CalendarIcon } from "lucide-react";

const clientQuestions = [
  {
    id: "clientes1",
    question: "¿Cómo registro un nuevo cliente?",
    answer:
      "Haz clic en 'Clientes', luego en 'Nuevo Cliente' y completa los datos requeridos.",
  },
  {
    id: "clientes2",
    question: "¿Cómo añado una mascota a un cliente existente?",
    answer:
      "Selecciona un cliente, entra en su perfil y haz clic en 'Agregar mascota'.",
  },
  {
    id: "clientes3",
    question: "¿Cómo veo el historial médico de una mascota?",
    answer:
      "Dentro del perfil de la mascota, accede a la pestaña de historial médico.",
  },
];

const appointmentQuestions = [
  {
    id: "citas1",
    question: "¿Cómo programo una nueva cita?",
    answer:
      "Desde la sección de Citas, haz clic en 'Nueva Cita' y completa la información.",
  },
  {
    id: "citas2",
    question: "¿Cómo modifico o cancelo una cita?",
    answer:
      "Selecciona la cita en el calendario y elige 'Editar' o 'Cancelar'.",
  },
  {
    id: "citas3",
    question: "¿Cómo registro la asistencia a una cita?",
    answer:
      "Abre la cita y marca la opción de 'Asistencia confirmada' o 'No asistió'.",
  },
];

interface ClientAppointmentHelpProps {
  searchTerm: string;
}

function normalize(text: string | undefined | null): string {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .replace(/[¿¡?!.,]/g, "")        // quitar signos
    .trim();
}


export default function ClientAppointmentHelp({
  searchTerm,
}: ClientAppointmentHelpProps) {
  const normalizedSearch = normalize(searchTerm);

  const filter = (q: { question: string; answer: string }) =>
    normalize(q.question).includes(normalizedSearch) ||
    normalize(q.answer).includes(normalizedSearch);

  const cards = [
    {
      icon: <UserIcon />,
      title: "Clientes",
      description: "Gestión de clientes y sus mascotas",
      questions: clientQuestions.filter(filter),
    },
    {
      icon: <CalendarIcon />,
      title: "Citas",
      description: "Programación y gestión de citas",
      questions: appointmentQuestions.filter(filter),
    },
  ].filter((card) => card.questions.length > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card, idx) => (
        <HelpCard
          key={idx}
          icon={card.icon}
          title={card.title}
          description={card.description}
          questions={card.questions}
        />
      ))}
    </div>
  );
}
