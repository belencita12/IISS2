import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import Hero from "@/components/unauthorizePage/Hero";
import Products from "@/components/unauthorizePage/Products";
import Services from "@/components/unauthorizePage/Services";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/user-profile");
  }
  return (
    <div className="sm:px-[6.5%] px-5 max-w-full overflow-hidden">
      <Hero />
      <Services />
      <Products />
      <Image
        src="/image gato.png"
        alt="Gato"
        width={1500}
        height={400}
        className="object-contain rounded-xl w-full max-w-[1500px] mx-auto"
      />
    </div>
  );
}
