// app/profile/page.tsx  (o donde tengas tu Route Handler de Next.js)

import { Appointments } from "@/components/profile/Appointments";
import { Header, HeaderProps } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";
import { VeterinaryProducts } from "@/components/profile/Product";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { getAuth } from "@/components/profile/getAuth"; // importa tu helper
import { IUserProfile } from "@/lib/client/IUserProfile";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  const { user } = session;
  if (!user?.clientId) return notFound();

  // 1. Llama al endpoint /me desde el servidor
  const profile: IUserProfile = await getAuth(user.token);

  // 2. Empaqueta sólo lo que le quieres pasar al Header
  const headerProps: HeaderProps = {
    fullName: profile.fullName,
    token: user.token,
    adress: profile.adress,
    phoneNumber: profile.phoneNumber,
    email: profile.email,
  };

  return (
    <div>
      <Header {...headerProps} />
      <PetsList clientId={user.clientId} token={user.token} />
      <Appointments />
      <VeterinaryProducts />
    </div>
  );
}
