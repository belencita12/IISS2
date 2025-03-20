import DepositList from "@/components/depositUI/DepositList";
import UserBar from "@/components/depositUI/UserBar";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";

export default async function Page() {
    const session = await getServerSession(authOptions);
    if(session){
      const token = session?.user.token;
      const nombre = session?.user.fullName;
  
      return <div className="flex justify-center">
        <div className="w-4/5 space-y-4">
          <UserBar token={token} nombre={nombre}/>
          <DepositList token={token}/>
        </div>
      </div>
      
    }
}