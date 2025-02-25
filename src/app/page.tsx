import Hero from "@/components/unauthorizePage/Hero";
import Products from "@/components/unauthorizePage/Products";
import Services from "@/components/unauthorizePage/Services";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <Products />
      <img
        src="/image gato.png"
        alt="Gato"
        width={1500}
        height={400}
        className="object-contain rounded-xl"
      />
    </div>
  );
}
