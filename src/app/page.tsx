import Hero from "@/components/unauthorizePage/Hero";
import Products from "@/components/unauthorizePage/Products";
import Services from "@/components/unauthorizePage/Services";

export default function Home() {
  return (
    <div className="sm:px-[6.5%] px-5 max-w-full overflow-hidden">
      <Hero />
      <Services />
      <Products />
      <img
        src="/image gato.png"
        alt="Gato"
        width={1500}
        height={400}
        className="object-contain rounded-xl w-full max-w-[1500px] mx-auto"
      />
    </div>
  );
}
