import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getPetsByUserIdFull } from "@/lib/pets/getPetsByUserId";
import PetDetailView from "@/components/admin/pet/PetDetailView";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; petId: string }>;
}) {
  const resolvedParams = await params;
  const petId = Number(resolvedParams.petId);
  const clientId = Number(resolvedParams.id);
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";

  const petData = await getPetsByUserIdFull(clientId, token);
  const pets = petData.data;
  const pet = pets.find((p) => p.id === petId);
  if (!pet) return notFound();

  return <PetDetailView pet={pet} clientId={clientId} token={token} />;
}