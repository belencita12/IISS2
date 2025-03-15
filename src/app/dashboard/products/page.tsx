import AdminProductPage from "@/components/admin/product/ProductList";
import authOptions from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return <AdminProductPage token={token} />;
  }

  redirect('/login');
}