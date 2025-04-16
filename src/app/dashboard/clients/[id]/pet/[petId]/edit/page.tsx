import PetUpdateForm from "@/components/admin/pet/PetUpdateForm";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getClientById } from "@/lib/client/getClientById";
import { notFound } from "next/navigation";

export default async function PetUpdatePage(
  { params }: { params: Promise<{ id: string }> } // Asegúrate que la ruta incluya [id]
) {
 
  const clientId = Number(params.id);
  
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const token = session.user.token;

  try {
    const client = await getClientById(clientId, token);
    if (!client) {
      return notFound(); // Cliente no existe
    }

    return (
      <div>
        <PetUpdateForm token={token} />
      </div>
    );
  } catch (error) {
    return notFound(); // Error al verificar cliente
  }
}
