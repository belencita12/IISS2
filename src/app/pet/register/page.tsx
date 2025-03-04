import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options"
import PetForm from "@/components/pets/PetForm";
import { Toaster } from "@/components/ui/sonner";

export default async function Home() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const token = session?.user?.token;

    console.log("Sesión:", { userId, token });

    return (
        <div>
            <PetForm userId={userId} token={token} />
            <Toaster
                richColors
                position="top-center"
                toastOptions={{
                    duration: 5000,
                }}
            />
        </div>
    );
}

