// app/dashboard/vaccine/manufacturer/page.tsx
import ManufacturerList from "@/components/admin/vaccine/ManufacturerList";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function ManufacturerListPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    redirect("/login");
  }

  return (
    <div>
      <ManufacturerList token={token} />
    </div>
  );
}
