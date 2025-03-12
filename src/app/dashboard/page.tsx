import { Header } from "@/components/admin/Header";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function Dashboard() {
   const session = await getServerSession(authOptions);
    console.log("Sesión:", session?.user?.fullName);
    console.log("Sesión:", session?.user?.token);
    if (!session) {
        redirect("/login");
    }
    return (
        <div>
            <Header fullName={session?.user?.fullName} />
        </div>
    );
}
