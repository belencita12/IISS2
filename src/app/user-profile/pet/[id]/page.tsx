import PetDetails from "@/components/pet/PetDetails";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.token) {
    redirect("/login");
  }

  return (
    <div>
      <PetDetails token={session.user.token} />
    </div>
  );
}
