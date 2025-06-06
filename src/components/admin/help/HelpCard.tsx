"use client";
import YouTubeEmbed from "@/components/global/YoutubeVideo"; 
import { ReactNode, useState } from "react";
import {
  Root,
  Item,
  Header,
  Trigger,
  Content,
} from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export interface HelpCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  questions: { id: string; question: string; answer: string }[];
  isSingle?: boolean;
  videoId?: string;
}

export default function HelpCard({
  icon,
  title,
  description,
  questions,
  isSingle = false,
  videoId,
}: HelpCardProps) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const t = useTranslations("help.card")

  return (
    <div
      className={`border rounded-lg bg-white shadow-sm ${
        isSingle ? "p-8 text-lg" : "p-6"
      }`}
    >
      <div className="flex items-center mb-2">
        <div className="mr-2">{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>

      {videoId && (
        <div className="mt-8 mb-8">
          <h3 className="text-lg font-semibold mb-2">{t("video")}</h3>
          <YouTubeEmbed videoId={videoId} />
        </div>
      )}

      <Root
        type="single"
        value={openItem}
        onValueChange={(val) => setOpenItem(val)}
        className="space-y-4"
        collapsible
      >
        {questions.map((q) => (
          <Item key={q.id} value={q.id} className="border-b pb-4">
            <Header>
              <Trigger className="flex justify-between w-full text-left font-medium hover:underline transition-all data-[state=open]:text-black">
                {q.question}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
              </Trigger>
            </Header>
            <Content className="mt-2 text-gray-700">{q.answer}</Content>
          </Item>
        ))}
      </Root>
    </div>
  );
}
