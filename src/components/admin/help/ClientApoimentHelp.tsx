import HelpCard from "./HelpCard";
import { UserIcon, CalendarIcon } from "lucide-react";

const clientQuestions = [
  {
    id: "clientes1",
    question: "¿Cómo registro un nuevo cliente?",
    answer:
      "Para registrar un nuevo cliente, haz clic en 'Clientes', luego selecciona 'Agregar' y completa todos los datos solicitados.",
  },
  {
    id: "clientes2",
    question: "¿Cómo añado una mascota a un cliente existente?",
    answer:
      "En la sección 'Clientes', selecciona el cliente deseado haciendo clic en el ícono de 'ver' (ojo), haz clic en 'Agregar' y completa la información requerida.",
  },
  {
    id: "clientes3",
    question: "¿Cómo veo el historial médico de una mascota?",
    answer:
      "Dentro del perfil del cliente, selecciona la mascota correspondiente haciendo clic en el ícono de 'ver' (ojo) para ver su detalle. Allí encontrarás el historial de vacunación y las visitas registradas.",
  },
];

const appointmentQuestions = [
  {
    id: "citas1",
    question: "¿Cómo programo una nueva cita?",
    answer:
      "Desde la sección 'Citas', haz clic en 'Agendar' y completa la información requerida para programar la cita.",
  },
  {
    id: "citas2",
    question: "¿Cómo cancelo una cita?",
    answer:
      "En la lista de citas dentro de la sección 'Citas', haz clic en 'Cancelar', ingresa el motivo de la cancelación y confirma la acción.",
  },
  {
    id: "citas3",
    question: "¿Cómo finalizo una cita?",
    answer:
      "En la sección 'Citas', desde la lista de citas, haz clic en 'Finalizar' y luego confirma para completar el proceso.",
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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿¡?!.,]/g, "")
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

  const isSingle = cards.length === 1;

  return (
    <div
      className={`grid ${isSingle ? "" : "grid-cols-1 md:grid-cols-2"} gap-6`}
    >
      {cards.map((card, idx) => (
        <HelpCard
          key={idx}
          icon={card.icon}
          title={card.title}
          description={card.description}
          questions={card.questions}
          isSingle={isSingle}
        />
      ))}
    </div>
  );
}
