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
    throw new Error("Error al obtener información del usuario");
  }

  const user = await res.json();

  return user as IUserProfile;
};
