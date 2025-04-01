import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import PetForm from "@/components/pet/PetForm";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  const clientId=session?.user?.clientId;
  const token = session?.user?.token;

  console.log("Sesión:", { clientId, token });

  return (
    <div>
      <PetForm clientId={clientId} token={token} />
    </div>
  );
}
