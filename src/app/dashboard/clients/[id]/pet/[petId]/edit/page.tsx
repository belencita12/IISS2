import PetUpdateForm from "@/components/admin/pet/PetUpdateForm";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function PetUpdatePage() {
  const session = await getServerSession(authOptions);
  if (session) {
    const token = session?.user.token;
    console.log(token);

    return (
      <div>
        <PetUpdateForm token={token} />
      </div>
    );
  }

  redirect("/login");
}
