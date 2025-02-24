import React from "react";
//import Header from "./components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Products from "../components/Products";

const Index = () => {
    return (
      <main className="px-[6%]">
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
      </main>
    );
  };
  
  export default Index;
