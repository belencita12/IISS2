"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/lib/products/IProducts";
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const defaultImageSrc = "/NotImageNicoPets.png";

  const t = useTranslations();

  return (
    <div
      className="flex w-full max-w-[550px] min-w-[280px] h-[250px] m-2 rounded-lg shadow-md
                    hover:shadow-lg transition-shadow duration-300 overflow-hidden
                    bg-white text-gray-900"
    >
      <div className="w-[45%] relative h-full overflow-hidden rounded-l-lg">
        <Image
          src={product.image?.originalUrl || defaultImageSrc}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="w-[65%] p-4 flex flex-col justify-between">
        <div className="space-y-2 overflow-hidden">
          {product.tags && (
            <div className="flex flex-wrap gap-1 mb-1 max-h-[32px] overflow-hidden">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-600 text-[10px] font-medium
                             px-2 py-0.5 rounded-full border border-gray-300 truncate"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-md font-semibold line-clamp-2">{product.name}</h3>

          <div className="grid grid-cols-[1fr_0.6fr] gap-x-10 gap-y-2 text-xs">
            <div className="truncate">
              <span className="text-gray-600">{t("product.card.code")}</span>
              <p className="font-medium truncate">{product.code || "-"}</p>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-gray-600">{t("product.card.price")}</span>
              <p className="font-medium truncate">
                {product.price.toLocaleString()} {t("product.card.gs")}
              </p>
            </div>
            {product.provider && (
              <div className="truncate">
                <span className="text-gray-600">{t("product.card.provider")}</span>
                <p className="font-medium truncate">{product.provider.name}</p>
              </div>
            )}
            <div className="flex flex-col truncate">
              <span className="text-gray-600">{t("product.card.cost")}</span>
              <p className="font-medium truncate">
                {product.cost?.toLocaleString() || "-"} {t("product.card.gs")}
              </p>
            </div>
            <div className="truncate">
              <span className="text-gray-600">{t("product.card.category")}</span>
              <p className="font-medium truncate">
                {getCategoryLabel(product.category)}
              </p>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-gray-600">{t("product.card.quantity")}</span>
              <p className="font-medium truncate">{product.quantity}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onClick(product.id)}
          className="mt-2 w-full py-1 text-xs bg-gray-900 hover:bg-gray-800
                     text-white rounded-md"
        >
          {t("button.seeDetails")}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
