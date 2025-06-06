"use client";

import HelpCard from "./HelpCard";
import { HomeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardHelpProps {
  searchTerm: string;
}

function normalize(text: string | undefined | null): string {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function DashboardHelp({ searchTerm }: DashboardHelpProps) {
  const t = useTranslations("help.dashboard");

  const dashboardQuestions = [
    {
      id: t("dashboard1.id"),
      question: t("dashboard1.question"),
      answer: t("dashboard1.answer"),
    },
    {
      id: t("dashboard2.id"),
      question: t("dashboard2.question"),
      answer: t("dashboard2.answer"),
    },
    {
      id: t("dashboard3.id"),
      question: t("dashboard3.question"),
      answer: t("dashboard3.answer"),
    },
    {
      id: t("dashboard4.id"),
      question: t("dashboard4.question"),
      answer: t("dashboard4.answer"),
    },
  ];

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
        title={t("title")}
        description={t("description")}
        questions={filteredQuestions}
        isSingle={isSingle}
        videoId={searchTerm.trim() === "" ? "SqGaJniKwgo" : undefined}
      />
    </div>
  );
}
