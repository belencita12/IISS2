import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export default async function Hero() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations();
  const isAuthenticated = !!session;

  return (
    <section className="flex flex-col sm:flex-row items-center justify-around py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-0 w-full">
      <div className="text-center sm:text-left sm:mr-8 mb-6 sm:mb-0 w-full max-w-xl">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4 text-white relative">
          <span className="relative z-10  backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm inline-block whitespace-nowrap text-sm sm:text-base lg:text-3xl">¡Bienvenido a nuestra plataforma!</span>
        </h2>

        {!isAuthenticated && (
          <>
            <p className="text-white mb-6 text-xs sm:text-sm lg:text-base">
              {t("home.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="bg-white text-myPink-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-myPink-primary hover:bg-gray-100 cursor-pointer transition-all duration-300 text-xs sm:text-sm w-full sm:w-[140px] lg:w-[160px] text-center">
                     {t("home.hero.register")}
                </Button>
              </Link>

              <Link href="/login" className="w-full sm:w-auto">
                <Button className="bg-myPink-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-myPink-hover cursor-pointer transition-all duration-300 text-xs sm:text-sm w-full sm:w-[140px] lg:w-[160px] text-center">
                   {t("home.hero.login")}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="relative p-1 w-[200px] sm:w-[250px] lg:w-[300px]">
        <div className="absolute inset-0 bg-gradient-to-r from-myPurple-primary to-myPink-primary rounded-lg"></div>
        <div className="relative bg-white p-1 rounded-lg">
          <Image
            src="/image.png"
            alt="Logo1"
            width={300}
            height={300}
            style={{ width: '100%', height: 'auto' }}
            className="object-contain mt-6 sm:mt-0 rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
