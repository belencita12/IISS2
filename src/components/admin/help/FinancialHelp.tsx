import HelpCard from "./HelpCard";
import {
  CircleDollarSignIcon,
  HandCoinsIcon,
  FileIcon,
  BookUserIcon,
} from "lucide-react";

export const financialQuestions = {
  compras: [
    {
      id: "compras1",
      question: "¿Cómo registro una nueva compra?",
      answer:
        "Ve a la sección de Compras y haz clic en 'Nueva compra'. Luego selecciona al proveedor e ingresa los productos.",
    },
    {
      id: "compras2",
      question: "¿Cómo registro el pago de una compra?",
      answer:
        "Dentro de la compra registrada, haz clic en 'Registrar pago' e ingresa el monto y método de pago.",
    },
    {
      id: "compras3",
      question: "¿Cómo gestiono devoluciones a proveedores?",
      answer:
        "Selecciona la compra original y utiliza la opción 'Devolver productos' para registrar la devolución.",
    },
  ],
  ventas: [
    {
      id: "ventas1",
      question: "¿Cómo creo una nueva venta?",
      answer:
        "Dirígete a la sección de Ventas y haz clic en 'Nueva venta'. Agrega los productos, cliente y método de pago.",
    },
    {
      id: "ventas2",
      question: "¿Cómo aplico descuentos o promociones?",
      answer:
        "Durante la venta, puedes aplicar descuentos desde el panel derecho antes de finalizar.",
    },
    {
      id: "ventas3",
      question: "¿Cómo gestiono devoluciones de clientes?",
      answer:
        "En el historial de ventas, selecciona la venta y usa 'Registrar devolución' para actualizar el stock.",
    },
  ],
  facturas: [
    {
      id: "facturas1",
      question: "¿Cómo imprimo o envío una factura?",
      answer:
        "Desde el detalle de la venta, haz clic en 'Imprimir factura' o 'Enviar por correo'.",
    },
    {
      id: "facturas2",
      question: "¿Cómo anulo una factura?",
      answer:
        "Ubica la factura en el historial y selecciona 'Anular factura'. Debes indicar un motivo.",
    },
    {
      id: "facturas3",
      question: "¿Cómo genero reportes de ventas?",
      answer:
        "Ve a la sección de Reportes y selecciona el rango de fechas deseado para exportar el resumen.",
    },
  ],
  empleados: [
    {
      id: "empleados1",
      question: "¿Cómo registro un nuevo empleado?",
      answer:
        "Accede a la sección de Empleados y haz clic en 'Nuevo empleado'. Completa los datos personales y de acceso.",
    },
    {
      id: "empleados2",
      question: "¿Cómo asigno permisos a los usuarios?",
      answer:
        "Dentro del perfil del usuario, selecciona los roles y permisos correspondientes.",
    },
    {
      id: "empleados3",
      question: "¿Cómo registro la asistencia de los empleados?",
      answer:
        "Usa el módulo de Asistencia para marcar entradas y salidas diarias del personal.",
    },
  ],
};

interface FinancialHelpProps {
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

export default function FinancialHelp({ searchTerm }: FinancialHelpProps) {
  const normalizedSearch = normalize(searchTerm);

  const filter = (q: { question: string; answer: string }) =>
    normalize(q.question).includes(normalizedSearch) ||
    normalize(q.answer).includes(normalizedSearch);

  const cards = [
    {
      icon: <CircleDollarSignIcon />,
      title: "Compras",
      description: "Gestión de compras a proveedores",
      questions: financialQuestions.compras.filter(filter),
    },
    {
      icon: <HandCoinsIcon />,
      title: "Ventas",
      description: "Proceso de ventas y facturación",
      questions: financialQuestions.ventas.filter(filter),
    },
    {
      icon: <FileIcon />,
      title: "Facturas",
      description: "Gestión de documentos fiscales",
      questions: financialQuestions.facturas.filter(filter),
    },
    {
      icon: <BookUserIcon />,
      title: "Empleados",
      description: "Gestión de personal y usuarios del sistema",
      questions: financialQuestions.empleados.filter(filter),
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
