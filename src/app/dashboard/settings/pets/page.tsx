import ListPets from "@/components/admin/settings/pets/ListPets";
import authOptions from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function PetsPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return <ListPets token={token} />;
  }

  redirect('/login');
}