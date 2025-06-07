import ServiceTypeForm from '@/components/admin/settings/service-types/ServiceTypeForm';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/options';
import { redirect } from "next/navigation";

export default async function ServiceTypeRegisterPage() {
  
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/login");
    }

  return (
    <>
      <ServiceTypeForm 
        token={session?.user.token} 
      />
    </>
  );
} 