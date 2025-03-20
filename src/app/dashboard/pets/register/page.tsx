import AdminPetForm from "@/components/admin/pet/AdminPetForm";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function PetRegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    const token = session?.user.token;
    console.log(token);

    return (
      <div>
        <AdminPetForm token={token} />
      </div>
    );
  }

  redirect("/login");
  return;
}
