"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";


export default function AddToHistoryButton() {
  const router = useRouter();
  const b = useTranslations("Button");

  const handleClick = () => {
    router.push(`/dashboard/settings/vaccine-registry/new`);
  };

  return (
    <Button
      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
      onClick={handleClick}
    >
      {b("add")}
    </Button>
  );
}
