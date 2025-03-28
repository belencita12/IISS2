import ProviderList from "@/components/admin/provider/ProviderList";
import authOptions from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ProviderPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return <ProviderList token={token} />;
  }

  redirect('/login');
}