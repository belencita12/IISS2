"use client";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import ServiceTypeForm from "@/components/admin/settings/service-types/ServiceTypeForm";
import { getServiceTypeById } from "@/lib/service-types/service";

export default async function ServiceTypeEditPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (!token) {
    redirect("/login");
  }

  const serviceType = await getServiceTypeById(token, parseInt(params.id));

  return (
    <div className="p-6">
      <ServiceTypeForm 
        token={token} 
        defaultValues={serviceType}
        id={parseInt(params.id)}
      />
    </div>
  );
} 