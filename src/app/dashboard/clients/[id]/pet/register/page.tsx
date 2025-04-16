import PetRegisterForm from "@/components/admin/pet/PetRegisterForm";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function PetRegisterPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const { id } = params;
  if (session) {
    const token = session?.user.token;
    return (
      <div>
        <PetRegisterForm token={token} clientId={Number(id)} />
      </div>
    );
  }

  redirect("/login");
}
