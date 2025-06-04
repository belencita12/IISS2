import Hero from "@/components/unauthorizePage/Hero";
import Products from "@/components/unauthorizePage/Products";
import Services from "@/components/unauthorizePage/Services";
import Image from "next/image";
import ProductosBanner from "@/components/unauthorizePage/ProductosBanner";
import ServiciosBanner from "@/components/unauthorizePage/ServiciosBanner";

export default async function HomePublic() {
  return (
    <div className="sm:px-[6.5%] px-5 max-w-full overflow-hidden">
      <div className="absolute top-8 left-0 right-0 h-80 -z-20 bg-gradient-to-r from-myPurple-primary to-myPink-primary opacity-90 pt-72">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      <div className="relative z-10">
        <Hero />
        <Services />
        <Products />
        <Image
          src="/fin3.jpg"
          alt="Gato"
          width={1500}
          height={400}
          className="w-full h-[400px] sm:h-[400px] h-[200px] object-cover object-[center_70%] rounded-xl mx-auto"
        />
      </div>
    </div>
  );
}
