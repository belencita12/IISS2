import DepositList from "@/components/deposit/DepositList";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';


export default async function Page() {
  const session = await getServerSession(authOptions);
  if(session){
    const token = session?.user.token;

    return <div className="flex justify-center">
      <div className="w-4/5 space-y-4">
        <DepositList token={token}/>
      </div>
    </div>
    
  }
  redirect('/login');
}