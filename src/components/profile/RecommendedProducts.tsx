"use client";

import { useEffect, useState } from "react";
import { getProductByTag } from "@/lib/products/getProductByTag";
import { PetData } from "@/lib/pets/IPet";
import { Product } from "@/lib/products/IProducts";
import { Card } from "@/components/product/ProductCardCliente";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { ProductSkeleton } from "./skeleton/ProductSkeleton";
import { Carousel } from "./Carousel";
import { useTranslations } from "next-intl";

interface RecommendedProductsProps {
  clientId: number;
  token: string;
  pets: PetData[];
}

export const RecommendedProducts = ({
  token,
  pets,
}: RecommendedProductsProps) => {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const t = useTranslations("RecommendedProducts");
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const speciesTags = Array.from(
          new Set(pets.map((p) => p.species.name.toLowerCase()))
        );

        if (speciesTags.length === 0) {
          setRecommended([]);
          return;
        }

        const products = await getProductByTag(speciesTags, token);

        const unique = Object.values(
          products.reduce((acc, prod) => {
            acc[prod.id] = prod;
            return acc;
          }, {} as Record<string, Product>)
        );

        setRecommended(unique);
      } catch (err) {
        console.error(err);
        toast("error", "No se pudieron cargar recomendaciones");
      } finally {
        setLoading(false);
      }
    };

    if (pets && pets.length > 0 && token) {
      fetchRecommendations();
    } else {
      setLoading(false);
      setRecommended([]);
    }
  }, [pets, token]);

  if (loading) return <ProductSkeleton />;
  if (recommended.length === 0) return null;

  return (
    <section className="w-full p-6 bg-white rounded-lg shadow-sm text-center">
      <Carousel
        items={recommended}
        renderItem={(product) => (
          <div
            onClick={() => router.push(`/user-profile/product/${product.id}`)}
            className="cursor-pointer"
          >
            <Card
              title={product.name}
              price={`${product.price.toLocaleString()} Gs.`}
              image={product.image?.originalUrl ?? NotImageNicoPets.src}
              ctaText={t("ctaText")}
              ctaLink={`/user-profile/product/${product.id}`}
              tags={product.tags}
            />
          </div>
        )}
      />
    </section>
  );
};