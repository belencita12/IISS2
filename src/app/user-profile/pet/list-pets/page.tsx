import PetList from "@/components/pet/PetList";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const token = session.user.token;
  const clientId = session.user.clientId;

  if (!clientId) {
    redirect("/login");
  }

  return <PetList clientId={clientId} token={token} />;
}
