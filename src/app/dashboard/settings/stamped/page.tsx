import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { StampedList } from "@/components/admin/settings/stamped/StampedList";

export default async function StampedPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <StampedList token={token} />
    </div>
  );
} 