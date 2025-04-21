import ProductDetail from "@/components/admin/product/ProductDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getProductById } from "@/lib/products/getProductById";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const token = session.user.token as string;

  // Obtenemos producto, si no existe -> 404
  const product = await getProductById(productId, token).catch(() => null);
  if (!product) {
    notFound();
  }

  return <ProductDetail token={token} />;
}
