import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { Header } from "@/components/profile/Header";
import { MisDatos } from "@/components/profile/MisDatosPage";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  if (!user.token) return notFound();

  return (
    <div>
      
      <MisDatos token={user.token} />
    </div>
  );
}
