import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user?.token) {
    return redirect(
      session.user.roles.includes("ADMIN") ? "/dashboard" : "/user-profile"
    );
  }
  return redirect("/home");
}
