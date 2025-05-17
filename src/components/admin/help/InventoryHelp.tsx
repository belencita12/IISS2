import HelpCard from "./HelpCard";
import { BoneIcon, StoreIcon, BoxIcon, SyringeIcon } from "lucide-react";

const productQuestions = [
  {
    id: "productos1",
    question: "¿Cómo añado un nuevo producto al inventario?",
    answer:
      "Ve al menú lateral y selecciona 'Productos'. Luego, haz clic en el botón 'Agregar' para registrar un nuevo producto completando el formulario.",
  },
  {
    id: "productos2",
    question: "¿Cómo actualizo el precio de un producto?",
    answer:
      "En la sección de Productos, haz clic en el ícono de 'ver'(ojo) para ver el detalle del producto. Dentro del detalle, presiona 'Editar' y modifica el precio en el campo correspondiente. Guarda los cambios para actualizarlos.",
  },
  {
    id: "productos3",
    question: "¿Cómo elimino un producto?",
    answer:
      "Accede al detalle del producto haciendo clic en el ícono de 'ver'(ojo). Luego, presiona el botón 'Eliminar' y confirma la acción para remover el producto del sistema.",
  },
];

const vaccineQuestions = [
  {
    id: "vacunas1",
    question: "¿Cómo registro una vacunación?",
    answer:
      "Ingresa al perfil de la mascota, haz clic en 'Agregar al historial' en la sección de vacunación y completa los campos requeridos.",
  },
  {
    id: "vacunas2",
    question: "¿Cómo veo el calendario de vacunación de una mascota?",
    answer:
      "Dentro del perfil de la mascota, dirígete a la sección 'Historial de vacunación' y haz clic en el ícono de 'ver'(ojo) para ver los detalles de cada aplicación.",
  },
  {
    id: "vacunas3",
    question: "¿Cómo configuro recordatorios de vacunación?",
    answer:
      "Al registrar una nueva vacunación, puedes indicar la fecha de la aplicación actual y la fecha estimada para la próxima dosis utilizando el calendario disponible.",
  },
];

const warehouseQuestions = [
  {
    id: "depositos1",
    question: "¿Cómo creo un nuevo depósito?",
    answer:
      "Ve a la sección 'Depósitos' desde el menú lateral y haz clic en el botón 'Registrar Depósito'. Completa el formulario con la información requerida.",
  },
  {
    id: "depositos2",
    question: "¿Cómo edito o elimino un depósito existente?",
    answer:
      "En la lista de depósitos, localiza el que deseas modificar. Usa el ícono de lápiz para editar sus datos o el ícono de papelera para eliminarlo definitivamente.",
  },
  {
    id: "depositos3",
    question: "¿Puedo buscar depósitos por nombre?",
    answer:
      "Sí. En la parte superior de la sección 'Depósitos' encontrarás una barra de búsqueda donde puedes escribir el nombre del depósito que deseas encontrar.",
  },
];

const movementQuestions = [
  {
    id: "movimientos1",
    question: "¿Cómo registro una entrada de inventario?",
    answer:
      "Ve a la sección 'Movimientos' y haz clic en 'Registrar Movimiento'. Selecciona el tipo 'Ingreso', deja el campo de depósito de origen vacío, y completa los demás campos del formulario.",
  },
  {
    id: "movimientos2",
    question: "¿Cómo registro una salida de inventario?",
    answer:
      "En 'Movimientos', haz clic en 'Registrar Movimiento'. Elige el tipo 'Egreso', deja vacío el campo de depósito de destino, y completa el resto de los datos.",
  },
  {
    id: "movimientos3",
    question: "¿Cómo transfiero productos entre depósitos?",
    answer:
      "Desde la sección 'Movimientos', selecciona 'Registrar Movimiento'. Escoge el tipo 'Transferencia', luego selecciona tanto el depósito de origen como el de destino, y llena el resto del formulario.",
  },
];

function normalize(text: string | undefined | null): string {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿¡?!.,]/g, "")
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
