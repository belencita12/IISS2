"use client";

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

type PrintButtonProps = {
  onClick: () => Promise<void>;
  isLoading?: boolean;
};

export default function PrintButton({
  onClick,
  isLoading = false,
}: PrintButtonProps) {
  return (
    <Button onClick={onClick} className="w-full" disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Imprimir
    </Button>
  );
}
