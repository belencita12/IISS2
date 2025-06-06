import HelpCard from "./HelpCard";
import { BoneIcon, StoreIcon, BoxIcon, SyringeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface InventoryHelpPops{
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


export default function InventoryHelp({ 
  searchTerm,
 }: InventoryHelpPops) {

const t = useTranslations("help");

const productQuestions = [
  {
    id: t("inventory.products.productos1.id"),
    question: t("inventory.products.productos1.question"),
    answer:
      t("inventory.products.productos1.answer"),
  },
  {
    id: t("inventory.products.productos2.id"),
    question: t("inventory.products.productos2.question"),
    answer:
      t("inventory.products.productos2.answer") },
  {
    id: t("inventory.products.productos3.id"),
    question: t("inventory.products.productos3.question"),
    answer:
     t("inventory.products.productos3.answer"),
  },
];

const vaccineQuestions = [
  {
    id: t("inventory.vaccines.vacunas1.id"),
    question: t("inventory.vaccines.vacunas1.question"),
    answer:
     t("inventory.vaccines.vacunas1.answer"),
  },
  {
    id: t("inventory.vaccines.vacunas2.id"),
    question: t("inventory.vaccines.vacunas2.question"),
    answer:
     t("inventory.vaccines.vacunas2.answer"),
  },
  {
    id: t("inventory.vaccines.vacunas3.id"),
    question: t("inventory.vaccines.vacunas3.question"),
    answer:
      t("inventory.vaccines.vacunas3.answer"),
  },
];

const warehouseQuestions = [
  {
    id: t("inventory.stock.depositos1.id"),
    question: t("inventory.stock.depositos1.question"),
    answer:
      t("inventory.stock.depositos1.answer"),
  },
  {
    id: t("inventory.stock.depositos2.id"),
    question: t("inventory.stock.depositos2.question"),
    answer:
     t("inventory.stock.depositos2.answer"),
  },
  {
    id: t("inventory.stock.depositos3.id"),
    question: t("inventory.stock.depositos3.question"),
    answer:
     t("inventory.stock.depositos3.answer"),
  },
];

const movementQuestions = [
  {
    id: t("inventory.movements.movimientos1.id"),
    question: t("inventory.movements.movimientos1.question"),
    answer:
     t("inventory.movements.movimientos1.answer"),
  },
  {
    id: t("inventory.movements.movimientos2.id"),
    question: t("inventory.movements.movimientos2.question"),
    answer:
      t("inventory.movements.movimientos2.answer"),
  },
  {
    id: t("inventory.movements.movimientos3.id"),
    question: t("inventory.movements.movimientos3.question"),
    answer:
      t("inventory.movements.movimientos3.answer"),
  },
];



  const normalizedSearch = normalize(searchTerm);

  const filter = (q: { question: string; answer: string }) =>
    normalize(q.question).includes(normalizedSearch) ||
    normalize(q.answer).includes(normalizedSearch);

  const cards = [
    {
      icon: <BoneIcon />,
      title: t("inventory.products.title"),
      description: t("inventory.products.description"),
      questions: productQuestions.filter(filter),
      videoId: "l2JQjgj9-BI"
    },
    {
      icon: <SyringeIcon />,
      title: t("inventory.vaccines.title"),
      description: t("inventory.vaccines.description"),
      questions: vaccineQuestions.filter(filter),
      videoId: "laZi1g-s528"
    },
    {
      icon: <StoreIcon />,
      title: t("inventory.stock.title"),
      description: t("inventory.stock.description"),
      questions: warehouseQuestions.filter(filter),
      videoId: "zf4qMQNyM58"
    },
    {
      icon: <BoxIcon />,
      title: t("inventory.movements.title"),
      description: t("inventory.movements.description"),
      questions: movementQuestions.filter(filter),
      videoId: "j1sLZWj0dEw"
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
          videoId={card.videoId}
        />
      ))}
    </div>
  );
}
