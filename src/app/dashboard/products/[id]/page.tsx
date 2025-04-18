import ProductDetail from "@/components/admin/product/ProductDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getProductById } from "@/lib/products/getProductById";

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const token = session.user.token as string;

  // Intentamos obtener el producto, si falla -> 404
  const product = await getProductById(id, token).catch(() => null);
  if (!product) {
    notFound();
  }

  return <ProductDetail token={token} />;
}
