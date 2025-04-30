"use client";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import ServiceTypeForm from "@/components/admin/settings/service-types/ServiceTypeForm";

export default async function ServiceTypeRegisterPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <ServiceTypeForm token={token} />
    </div>
  );
} 