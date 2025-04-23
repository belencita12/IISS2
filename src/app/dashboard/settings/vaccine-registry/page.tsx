import VaccineRegistryList from "@/components/admin/vaccine-registry/VaccineRegistryList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";

/*IGNORAR ESTA PAGINA, NO ES PARTE DEL SPRINT, NO ESTÁ COMPLETA PERO SE HIZO SOLO PORQUE SI :)
ALGUN DÍA SE RETOMA EN SERIO */
export default async function Page() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (!token) {
    redirect("/login");
  }

  return <VaccineRegistryList token={token} />;
}
