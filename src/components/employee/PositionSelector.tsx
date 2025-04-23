import { useEffect, useState } from "react";
import { getWorkPosition } from "@/lib/employee/getWorkPosition";
import { Select } from "@/components/ui/select";

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

  useEffect(() => {
    setLoading(true);
    getWorkPosition(token)
      .then((data) => setPositions(data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <option value="">Selecciona un puesto</option>
      {positions.map((pos) => (
        <option key={pos.id} value={pos.id}>
          {pos.name}
        </option>
      ))}
    </Select>
  );
}