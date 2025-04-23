import SaleCreation from "@/components/admin/sales/SaleCreation";
import { Button } from "@/components/ui/button";
import authOptions from "@/lib/auth/options";
import { Printer } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MovementsPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return (
      <div className="container mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Crear Venta</h1>
        </div>
        <SaleCreation token={token} /> 
      </div>
    );
  }

  redirect("/login");
}
