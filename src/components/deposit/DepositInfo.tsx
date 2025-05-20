"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Deposit {
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  token: string;
  depositoId: number;
}

const DepositInfo: React.FC<Props> = ({ token, depositoId }) => {
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const s = useTranslations("StockList");
  const b = useTranslations("Button");

  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        const response = await fetch(`${apiUrl}/stock/${depositoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({})); // fallback si no es JSON
              const message = errorData?.message || `Error HTTP: ${response.status}`;
              throw new Error(message);
          }
        const data = await response.json();
        setDeposit(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDeposit();
  }, [depositoId, token]);

  if (loading) return <p>{b("loading")}</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold">{deposit?.name}</h2>
      <p className="text-gray-600">{s("address")}: {deposit?.address}</p>
    </div>
  );
};

export default DepositInfo;
