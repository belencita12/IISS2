"use client"
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Hero() {
  const { data: session } = useSession();
  return (

    <section className="flex flex-col sm:flex-row items-center justify-around py-10 sm:align-middle space-y-6 sm:space-y-0 w-full">
      <div className="text-center sm:mr-8 mb-6 sm:mb-0 w-full">
        <h2 className="text-3xl font-bold mb-4">
          ¡Bienvenido a nuestra plataforma!
        </h2>
        {!session && (
          <>
            <p className="text-gray-600 mb-6">
              Regístrate con nosotros y accede a una amplia gama de servicios para
              tu mascota.
            </p>
            <div className="flex justify-center items-center gap-5 w-full ">
              <Link href="/register" className="w-full max-w-[160px]">
                <Button className="bg-white text-black px-2 py-2 rounded-lg  border border-black hover:bg-gray-900 cursor-pointer hover:text-white transition-all duration-300 text-sm sm:text-lg w-full text-center">
                  Registrarse
                </Button>
              </Link>

              <Link href="/login" className="w-full max-w-[160px]">
                <Button className="bg-black  text-white px-2 py-2 rounded-lg hover:brightness-110 cursor-pointer transition-all duration-300 text-sm sm:text-lg w-full text-center">
                  Iniciar Sesion
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
      <Image
        src="/image.png"
        alt="Logo1"
        width={300}
        height={300}
        style={{ width: 'auto', height: 'auto' }}
        className="object-contain mt-6 sm:mt-0"
      />
    </section>
  );
}


export default function WrappedHero() {
  return <SessionProvider><Hero /></SessionProvider>
}