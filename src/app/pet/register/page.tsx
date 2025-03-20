import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import PetForm from "@/components/pets/PetForm";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  const userId = session?.user?.id;
  const token = session?.user?.token;

  console.log("Sesión:", { userId, token });

  return (
    <div>
      <PetForm userId={userId} token={token} />
    </div>
  );
}
