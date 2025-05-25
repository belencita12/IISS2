import Hero from "@/components/unauthorizePage/Hero";
import Products from "@/components/unauthorizePage/Products";
import Services from "@/components/unauthorizePage/Services";
import Image from "next/image";

export default async function HomePublic() {
  return (
    <div className="sm:px-[6.5%] px-5 max-w-full overflow-hidden">
      <Hero />
      <Services />
      <Products />
      <Image
        src="/fin5.jpg"
        alt="Gato"
        width={1500}
        height={400}
        className="object-contain rounded-xl w-full max-w-[1500px] max-h-[400] mx-auto"
      />
    </div>
  );
}
