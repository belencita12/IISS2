import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import NotificationsList from "@/components/notification/NotificationsList";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  if (!user?.clientId) return notFound();

  return (
    <NotificationsList
      token={user.token}
      userId={user.clientId}
    />
  );
} 