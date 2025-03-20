import ProductUpdateForm from "@/components/admin/product/ProductUpdate";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProductUpdatePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return <ProductUpdateForm token={token} />;
  }

  redirect("/login");
}
