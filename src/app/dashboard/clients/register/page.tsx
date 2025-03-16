import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import AdminUserCreationForm from "@/components/admin/client/RegisterClientForm";

export default async function CreateUserPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  
  const token = session?.user?.token;

  return (
    <div>

      <AdminUserCreationForm token={token} />
    </div>
  );
}
