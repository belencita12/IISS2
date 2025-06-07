"use client";
import React from "react";
import { PurchaseDetail } from "@/lib/purchases/IPurchaseDetail";
import Image from "next/image";
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel";
import { useTranslations } from "next-intl";

interface PurchaseProductCardProps {
  detail: PurchaseDetail;
}

const PurchaseProductCard: React.FC<PurchaseProductCardProps> = ({
  detail,
}) => {
  const { product, quantity } = detail;
  const defaultImageSrc = "/NotImageNicoPets.png";
  const p = useTranslations("ProductDetail");
  const t = useTranslations();

  return (
    <div
      className="flex flex-col md:flex-row w-full max-w-[550px] min-w-[280px] h-auto md:h-[210px] m-2
                 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden
                 bg-white text-gray-900"
    >
      <div className="w-full md:w-[35%] relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
        <Image
          src={product.image?.originalUrl || defaultImageSrc}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="w-full md:w-[65%] p-3 md:p-4 flex flex-col justify-between">
        <div className="space-y-2">
          {product.tags && (
            <div className="flex flex-wrap gap-1 mb-1 max-h-[48px] overflow-hidden">
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

          <h3 className="text-md font-semibold line-clamp-2">
            {product.name}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-[1fr_0.6fr] gap-x-4 gap-y-2 text-xs">
            <div className="truncate">
              <span className="text-gray-600">{t("product.card.code")}</span>
              <p className="font-medium truncate">{product.code || "-"}</p>
            </div>
            <div className="truncate">
              <span className="text-gray-600">{t("product.card.price")}</span>
              <p className="font-medium truncate">
                {product.price?.toLocaleString() || "0"} {t("product.card.gs")}
              </p>
            </div>
            <div className="truncate">
              <span className="text-gray-600">{t("product.card.category")}</span>
              <p className="font-medium truncate">
                {getCategoryLabel(product.category)}
              </p>
            </div>
            <div className="truncate">
              <span className="text-gray-600">{t("product.card.cost")}</span>
              <p className="font-medium truncate">
                {product.cost?.toLocaleString() || "0"} {t("product.card.gs")}
              </p>
            </div>
            <div className="truncate">
              <span className="text-gray-600">{t("product.card.quantity")}</span>
              <p className="font-medium truncate">{quantity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseProductCard;