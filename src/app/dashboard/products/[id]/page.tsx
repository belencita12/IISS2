import ProductDetail from "@/components/admin/product/ProductDetail";
import authOptions from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ProductDetailPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return <ProductDetail token={token} />;
  }

  redirect('/login');
}