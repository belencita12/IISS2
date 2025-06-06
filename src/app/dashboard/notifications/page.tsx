import NotificationsList from "@/components/admin/notifications/NotificationList";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function NotificationtListPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;

   const userId = session.user.id;

    return (
        <div className="mx-auto">
            <NotificationsList token={token} userId={userId}/>
        </div>
    );
  }

  redirect("/login");
}
