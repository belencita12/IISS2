// app/(profile)/page.tsx
import { Appointments } from "@/components/profile/Appointments";
import { Header } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";
import { VeterinaryProducts } from "@/components/profile/Product";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { getAuth } from "@/components/profile/getAuth"; // ruta ajusta si es distinto

export default async function Profile() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  if (!user?.clientId) return notFound();

  // —— 1️⃣ En el servidor obtenemos el RUC:
  const authData = await getAuth(user.token!);
  const ruc = authData?.ruc ?? null;

  return (
    <div>
      <Header fullName={user.fullName!} token={user.token!} />
      <PetsList clientId={user.clientId} token={user.token!} />
      <Appointments
        clientId={user.clientId}
        token={user.token!}
        ruc={ruc}
      />
      <VeterinaryProducts token={user.token!} />

    </div>
  );
}
