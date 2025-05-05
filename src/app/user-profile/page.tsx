// app/(profile)/page.tsx
import { Appointments } from "@/components/profile/Appointments";
import { Header } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";
import { RecommendedProducts } from "@/components/profile/Product";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { getAuth } from "@/components/profile/getAuth"; // ruta ajusta si es distinto
import ProfileTabs from "@/components/profile/ProfileTabs";
export default async function Profile() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  if (!user?.clientId) return notFound();

  // —— 1️⃣ En el servidor obtenemos el RUC:
  const authData = await getAuth(user.token!);
  const ruc = authData?.ruc ?? null;
  return (
    <ProfileTabs
    fullName={user.fullName!}
    token={user.token!}
    clientId={user.clientId}
    ruc={ruc}
  />
  );
}