import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import WorkPositionList from "@/components/admin/work-position/WorkPositionList";

export default async function WorkPositionPage() {
  const session = await getServerSession(authOptions);
  //console.log("SESSION:", session); // <-- TEMPORAL PARA DEBUG

  const token = session?.user?.token;

  if (!token) {
    redirect("/login"); 
  }

  return <WorkPositionList token={token} />;
}
