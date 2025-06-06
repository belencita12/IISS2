import HelpCard from "./HelpCard";
import {
  CircleDollarSignIcon,
  HandCoinsIcon,
  FileIcon,
  BookUserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

  const t = useTranslations("help.financial");

const financialQuestions = {
  compras: [
    {
      id: t("purchases.compras1.id"),
      question: t("purchases.compras1.question"),
      answer:
       t("purchases.compras1.answer"),
    },
    {
      id: t("purchases.compras2.id"),
      question: t("purchases.compras2.question"),
      answer:
        t("purchases.compras2.answer"),
    },
    {
      id: t("purchases.compras3.id"),
      question: t("purchases.compras3.question"),
      answer:
        t("purchases.compras3.answer"),
    },
  ],
  ventas: [
    {
      id: t("sales.ventas1.id"),
      question: t("sales.ventas1.question"),
      answer:
       t("sales.ventas1.answer"),
    },
    {
      id: t("sales.ventas2.id"),
      question: t("sales.ventas2.question"),
      answer:
       t("sales.ventas2.answer"),
    },
    {
      id: t("sales.ventas3.id"),
      question: t("sales.ventas3.question"),
      answer:
       t("sales.ventas3.answer"),
    },
    {
      id: t("sales.ventas4.id"),
      question: t("sales.ventas4.question"),
      answer:
       t("sales.ventas4.answer"),
    },
    {
      id: t("sales.ventas5.id"),
      question: t("sales.ventas5.question"),
      answer:
       t("sales.ventas5.answer"),
    },
  ],
  facturas: [
    {
      id: t("invoices.facturas1.id"),
      question: t("invoices.facturas1.question"),
      answer:
       t("invoices.facturas1.answer"),
    },
    {
      id: t("invoices.facturas2.id"),
      question: t("invoices.facturas2.question"),
      answer:
       t("invoices.facturas2.answer"),
    },
    {
      id: t("invoices.facturas3.id"),
      question: t("invoices.facturas3.question"),
      answer:
       t("invoices.facturas3.answer"),
    },
  ],
  empleados: [
    {
      id: t("employees.empleados1.id"),
      question: t("employees.empleados1.question"),
      answer:
      t("employees.empleados1.answer"),
    },
    {
      id:t("employees.empleados2.id"),
      question: t("employees.empleados2.question"),
      answer:
       t("employees.empleados2.answer"),
    },
    {
      id: t("employees.empleados3.id"),
      question: t("employees.empleados3.question"),
      answer:
       t("employees.empleados3.answer"),
    },
    {
      id: t("employees.empleados4.id"),
      question: t("employees.empleados4.question"),
      answer:
      t("employees.empleados4.answer"),
    },
  ],
};
  const normalizedSearch = normalize(searchTerm);

  const filter = (q: { question: string; answer: string }) =>
    normalize(q.question).includes(normalizedSearch) ||
    normalize(q.answer).includes(normalizedSearch);

  const cards = [
    {
      icon: <CircleDollarSignIcon />,
      title: t("purchases.title"),
      description: t("purchases.description"),
      questions: financialQuestions.compras.filter(filter),
      videoId: "R3lpahy9PdM"
    },
    {
      icon: <HandCoinsIcon />,
      title: t("sales.title"),
      description: t("sales.description"),
      questions: financialQuestions.ventas.filter(filter),
      videoId: "hWgGIQ-gLEc"
    },
    {
      icon: <FileIcon />,
      title: t("invoices.title"),
      description: t("invoices.description"),
      questions: financialQuestions.facturas.filter(filter),
      videoId: "792dwdK3_4k"
    },
    {
      icon: <BookUserIcon />,
      title:t("employees.title"),
      description: t("employees.description"),
      questions: financialQuestions.empleados.filter(filter),
      videoId: "38N5B9hITEw"
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
          videoId={card.videoId}
        />
      ))}
    </div>
  );
}
