import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user.token;
  if (isLoggedIn) {
    const isAdmin = session?.user.roles.includes("ADMIN")
    if (isAdmin) {
      redirect("/dashboard");
    } else {
      redirect("/user-profile");
    }
  }
  return (
    <>
      {children}
    </>
  );
}
