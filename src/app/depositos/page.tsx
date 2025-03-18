import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";

export default async function Page() {
    const session = await getServerSession(authOptions);
    if(session){
      const token = session?.user.token;
      console.log(token);
  
      return <div></div>
    }
}