import MovementRegisterForm from "@/components/admin/movement/MovementRegister";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MovementRegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return <MovementRegisterForm token={token} />;
  }

  redirect("/login");
}
