import HelpCard from "./HelpCard";
import { BoneIcon, StoreIcon, BoxIcon, SyringeIcon } from "lucide-react";

const productQuestions = [
  {
    id: "productos1",
    question: "¿Cómo añado un nuevo producto al inventario?",
    answer:
      "Ve a la sección de Inventario > Productos y haz clic en 'Agregar producto'.",
  },
  {
    id: "productos2",
    question: "¿Cómo actualizo el precio de un producto?",
    answer:
      "Selecciona el producto y edita el campo de precio en los detalles del mismo.",
  },
  {
    id: "productos3",
    question: "¿Cómo configuro alertas de stock bajo?",
    answer:
      "En el formulario del producto, establece el umbral de alerta de stock.",
  },
];

const vaccineQuestions = [
  {
    id: "vacunas1",
    question: "¿Cómo registro una vacunación?",
    answer:
      "Dirígete al perfil de la mascota, haz clic en 'Registrar vacunación' y completa los datos.",
  },
  {
    id: "vacunas2",
    question: "¿Cómo veo el calendario de vacunación de una mascota?",
    answer:
      "Dentro del perfil de la mascota, accede a la sección de Vacunas > Calendario.",
  },
  {
    id: "vacunas3",
    question: "¿Cómo configuro recordatorios de vacunación?",
    answer:
      "Desde el calendario de vacunas, activa la opción de 'Recordatorio automático'.",
  },
];

const warehouseQuestions = [
  {
    id: "depositos1",
    question: "¿Cómo creo un nuevo depósito?",
    answer: "Ve a la sección de Depósitos y haz clic en 'Nuevo depósito'.",
  },
  {
    id: "depositos2",
    question: "¿Cómo transfiero productos entre depósitos?",
    answer:
      "En el menú de movimientos, selecciona 'Transferencia' e indica los depósitos origen y destino.",
  },
  {
    id: "depositos3",
    question: "¿Cómo veo el inventario por depósito?",
    answer:
      "Filtra la vista de inventario por el depósito deseado en la sección correspondiente.",
  },
];

const movementQuestions = [
  {
    id: "movimientos1",
    question: "¿Cómo registro una entrada de inventario?",
    answer:
      "En la sección de Movimientos, haz clic en 'Nueva entrada' y completa el formulario.",
  },
  {
    id: "movimientos2",
    question: "¿Cómo registro una salida de inventario?",
    answer:
      "Selecciona 'Nueva salida' en la sección de Movimientos e ingresa los detalles.",
  },
  {
    id: "movimientos3",
    question: "¿Cómo corrijo un error en un movimiento?",
    answer:
      "Localiza el movimiento en el historial y haz clic en 'Editar' para corregirlo.",
  },
];

function normalize(text: string | undefined | null): string {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .replace(/[¿¡?!.,]/g, "")        // quitar signos
    .trim();
}

export default function InventoryHelp({ searchTerm }: { searchTerm: string }) {
  const normalizedSearch = normalize(searchTerm);

  const filter = (q: { question: string; answer: string }) =>
    normalize(q.question).includes(normalizedSearch) ||
    normalize(q.answer).includes(normalizedSearch);

  const cards = [
    {
      icon: <BoneIcon />,
      title: "Productos",
      description: "Gestión de productos y servicios",
      questions: productQuestions.filter(filter),
    },
    {
      icon: <SyringeIcon />,
      title: "Vacunas",
      description: "Control y registro de vacunaciones",
      questions: vaccineQuestions.filter(filter),
    },
    {
      icon: <StoreIcon />,
      title: "Depósitos",
      description: "Gestión de múltiples ubicaciones de inventario",
      questions: warehouseQuestions.filter(filter),
    },
    {
      icon: <BoxIcon />,
      title: "Movimientos",
      description: "Registro de entradas, salidas y transferencias",
      questions: movementQuestions.filter(filter),
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
