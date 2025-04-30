import { notFound } from 'next/navigation';
import ServiceTypeForm from '@/components/admin/settings/service-types/ServiceTypeForm';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/options';

export default async function ServiceTypeRegisterPage() {

  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;
  
  if (!token) {
    notFound();
  }

  return (
    <>
    <ServiceTypeForm token={token} />
    </>
  )
} 
