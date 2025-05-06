import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { getAuth } from "@/components/profile/getAuth";
import ProfileTabs from "@/components/profile/ProfileTabs";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  if (!user?.clientId) return notFound();

  //para obtener el ruc del cliente desde auth/me usando el token recibido de session
  const authData = await getAuth(user.token!);
  const ruc = authData?.ruc ?? null;
  //para obtener la foto de perfil del cliente rapido
  const avatarSrc = authData?.image?.originalUrl ?? "/blank-profile-picture-973460_1280.png";

  return (
    <ProfileTabs
      fullName={user.fullName!}
      token={user.token!}
      clientId={user.clientId}
      ruc={ruc}
      avatarSrc={avatarSrc}
    />
  );
}
