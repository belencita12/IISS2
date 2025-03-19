import AdminPetDetails from "@/components/admin/pet/AdminPetDetails";
import PetDetails from "@/components/petUI/PetDetails";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    const token = session?.user.token;
    const roles = session?.user.roles;

    console.log(token);

    return (
      <div>
        {roles.includes("ADMIN") ? (
          <AdminPetDetails token={token} />
        ) : (
          <PetDetails token={token} />
        )}
      </div>
    );
  }
  return;
}
