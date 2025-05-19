import { FileText, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

type ExportButtonProps = {
  handleGetReport: () => Promise<void>;
  isLoading?: boolean;
};

const ExportButton = ({
  isLoading = false,
  handleGetReport,
}: ExportButtonProps) => {
  return (
    <Button
      disabled={isLoading}
      onClick={handleGetReport}
      className="flex gap-1 items-center disabled:opacity-75"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <FileText />}
      Exportar
    </Button>
  );
};

export default ExportButton;
