//import ServiceDetail from "@/components/services/ServiceDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";

export default async function Page() {
    const session = await getServerSession(authOptions);
    const token = session?.user.token;
    return (
        <div>
          
        </div>
    );
}
