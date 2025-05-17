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
        "En la sección 'Compras', haz clic en 'Registrar compra'. Luego selecciona el proveedor, el depósito e ingresa los productos correspondientes.",
    },
    {
      id: "compras2",
      question: "¿Dónde puedo ver el listado de compras?",
      answer:
        "El listado de compras se encuentra en la vista principal de la sección 'Compras', donde se muestran los detalles de cada operación registrada.",
    },
    {
      id: "compras3",
      question: "¿Cómo visualizo el detalle de una compra?",
      answer:
        "Haz clic sobre la compra deseada en el listado para acceder a su detalle completo.",
    },
  ],
  ventas: [
    {
      id: "ventas1",
      question: "¿Cómo creo una nueva venta?",
      answer:
        "Accede a la opción 'Crear Venta' desde el menú lateral. Primero selecciona un depósito, luego elige la condición de venta, busca un cliente, selecciona los productos disponibles, define el método de pago, ingresa el monto y haz clic en 'Finalizar Venta'.",
    },
    {
      id: "ventas2",
      question: "¿Por qué no puedo agregar productos a la venta?",
      answer:
        "Debes seleccionar un depósito antes de agregar productos. Solo así se cargarán los productos disponibles en ese depósito.",
    },
    {
      id: "ventas3",
      question: "¿Qué métodos de pago puedo utilizar y cómo los agrego?",
      answer:
        "Puedes utilizar Pago Móvil, Efectivo, Transferencia Bancaria, Tarjeta de Débito o Crédito. Selecciona el método, ingresa el monto y haz clic en 'Agregar'. Puedes combinar varios métodos si es necesario.",
    },
    {
      id: "ventas4",
      question: "¿Cómo verifico el total de la venta antes de finalizar?",
      answer:
        "El total de la venta se actualiza automáticamente en el panel derecho 'Resumen de Venta' a medida que agregas productos y métodos de pago.",
    },
    {
      id: "ventas5",
      question: "¿Puedo realizar ventas a crédito?",
      answer:
        "Sí. En el campo 'Condición de Venta', selecciona la opción 'Crédito' si está habilitada. Asegúrate de tener los permisos necesarios para operar con esta modalidad.",
    },
  ],
  facturas: [
    {
      id: "facturas1",
      question: "¿Cómo consulto una factura específica?",
      answer:
        "Utiliza los filtros disponibles (como RUC, monto mínimo/máximo, o rango de fechas) para ubicar la factura deseada. Luego haz clic en el ícono de 'ver' (ojo) en la columna de acciones.",
    },
    {
      id: "facturas2",
      question: "¿Cómo sé si una factura está pagada?",
      answer:
        "En la columna 'Pagado', puedes verificar si el monto abonado coincide con el total de la factura. Si ambos valores son iguales, la factura está saldada.",
    },
    {
      id: "facturas3",
      question: "¿Dónde puedo ver todas las facturas?",
      answer:
        "En la sección 'Facturas', tienes acceso al listado completo de facturas emitidas. Puedes filtrarlas por fecha, cliente o estado de pago.",
    },
  ],
  empleados: [
    {
      id: "empleados1",
      question: "¿Cómo registro un nuevo empleado?",
      answer:
        "Haz clic en el botón 'Agregar' en la parte superior derecha de la sección 'Empleados'. Completa los campos requeridos como nombre, correo, RUC y cargo.",
    },
    {
      id: "empleados2",
      question: "¿Cómo edito los datos de un empleado?",
      answer:
        "En el listado de empleados, haz clic en el ícono de lápiz en la columna de acciones del empleado que deseas modificar. Realiza los cambios y guarda la información.",
    },
    {
      id: "empleados3",
      question: "¿Cómo elimino a un empleado?",
      answer:
        "Haz clic en el ícono de papelera correspondiente al empleado que deseas eliminar. Se te pedirá confirmación antes de realizar la acción.",
    },
    {
      id: "empleados4",
      question: "¿Cómo accedo a las citas programadas de un empleado?",
      answer:
        "Haz clic en el ícono de 'ver' (ojo) para ingresar al perfil del empleado. Allí podrás ver la lista de citas en las que está asignado.",
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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿¡?!.,]/g, "")
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
          isSingle={false}
        />
      ))}
    </div>
  );
}
