import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import TagList from "@/components/admin/settings/tags/TagList";

export default async function RacePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const token = session.user.token;

  return (
    <div>
      <TagList token={token} />
    </div>
  );
}
