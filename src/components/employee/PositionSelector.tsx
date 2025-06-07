import { useEffect, useState } from "react";
import { getWorkPosition } from "@/lib/employee/getWorkPosition";
import { Select } from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface Position {
  id: number;
  name: string;
}

interface Props {
  token: string;
  value: string;
  onChange: (id: string) => void;
}

export default function PositionSelector({ token, value, onChange }: Props) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);

  const t = useTranslations();

  useEffect(() => {
    setLoading(true);
    getWorkPosition(token)
      .then((data) => setPositions(data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <option value="">{t("placeholder.select")}</option>
      {positions.map((pos) => (
        <option key={pos.id} value={pos.id}>
          {pos.name}
        </option>
      ))}
    </Select>
  );
}