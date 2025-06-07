import { AUTH_API } from "@/lib/urls";
import { IUserProfile } from "@/lib/client/IUserProfile";

export const getAuth = async (token: string): Promise<IUserProfile> => {
  const res = await fetch(`${AUTH_API}/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({})); // fallback si no es JSON
    const message = errorData?.message || `Error HTTP: ${res.status}`;
    throw new Error(message);
  }

  const user = await res.json();

  return user as IUserProfile;
};
