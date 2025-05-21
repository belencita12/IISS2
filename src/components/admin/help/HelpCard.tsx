"use client";

import { ReactNode, useState } from "react";
import {
  Root,
  Item,
  Header,
  Trigger,
  Content,
} from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export interface HelpCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  questions: { id: string; question: string; answer: string }[];
  isSingle?: boolean;
}

export default function HelpCard({
  icon,
  title,
  description,
  questions,
  isSingle = false,
}: HelpCardProps) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

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
