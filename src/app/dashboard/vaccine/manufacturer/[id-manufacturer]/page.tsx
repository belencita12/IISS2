import ManufacturerDetail from "@/components/admin/vaccine-manufacturer/ManufacturerDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ManufacturerDetailPage({
  params,
}: {
  params: Promise<{ "id-manufacturer": string }>;
}) {
  const resolvedParams = await params;
  const id = Number(resolvedParams["id-manufacturer"]);

  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";

  if (!token) {
    redirect("/login");
  }

  return <ManufacturerDetail id={id} token={token} />;
}
