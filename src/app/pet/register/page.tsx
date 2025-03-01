"use client";

import PetForm from "@/components/pets/PetForm";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

export default function Home() {
    return (
        <SessionProvider>
            <div className="min-h-screen p-6">
                <PetForm />
                <Toaster
                    richColors
                    position="top-center"
                    toastOptions={{
                        duration: 5000,
                    }}
                />
            </div>
        </SessionProvider>
    );
}
