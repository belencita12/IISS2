"use client";

import { useTranslations } from "next-intl";
import HelpCard from "./HelpCard";
import { UserIcon, CalendarIcon } from "lucide-react";

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
  const t = useTranslations("help.clientAppointmentHelp");

  const clientQuestions = [
    {
      id: "clientes1",
      question: t("clients.questions.1.question"),
      answer: t("clients.questions.1.answer"),
    },
    {
      id: "clientes2",
      question: t("clients.questions.2.question"),
      answer: t("clients.questions.2.answer"),
    },
    {
      id: "clientes3",
      question: t("clients.questions.3.question"),
      answer: t("clients.questions.3.answer"),
    },
  ];

  const appointmentQuestions = [
    {
      id: "citas1",
      question: t("appointments.questions.1.question"),
      answer: t("appointments.questions.1.answer"),
    },
    {
      id: "citas2",
      question: t("appointments.questions.2.question"),
      answer: t("appointments.questions.2.answer"),
    },
    {
      id: "citas3",
      question: t("appointments.questions.3.question"),
      answer: t("appointments.questions.3.answer"),
    },
  ];

  const normalizedSearch = normalize(searchTerm);

  const filter = (q: { question: string; answer: string }) =>
    normalize(q.question).includes(normalizedSearch) ||
    normalize(q.answer).includes(normalizedSearch);

  const cards = [
    {
      icon: <UserIcon />,
      title: t("clients.title"),
      description: t("clients.description"),
      questions: clientQuestions.filter(filter),
      videoId: "C1hcquSQ1lc",
    },
    {
      icon: <CalendarIcon />,
      title: t("appointments.title"),
      description: t("appointments.description"),
      questions: appointmentQuestions.filter(filter),
      videoId: "mXX_PPf3zlQ",
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
