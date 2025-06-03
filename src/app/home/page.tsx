import Hero from "@/components/unauthorizePage/Hero";
import Products from "@/components/unauthorizePage/Products";
import Services from "@/components/unauthorizePage/Services";
import Image from "next/image";
import ProductosBanner from "@/components/unauthorizePage/ProductosBanner";
import ServiciosBanner from "@/components/unauthorizePage/ServiciosBanner";

export default async function HomePublic() {
  return (
    <div className="sm:px-[6.5%] px-5 max-w-full overflow-hidden">
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
  );
}
