"use client";

import React from "react";
import type { Product } from "@/lib/products/IProducts";
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel";
import ProductDetailSkeleton from "./skeleton/ProductDetailSkeleton";
import {useTranslations} from "next-intl"

interface ProductInfoProps {
  product: Product;
  isStockLoading: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  isStockLoading = false,
}) => {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      {product.description && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">{t("product.details.description")}</h3>
          <p>{product.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 ">{t("product.details.code")}</h3>
          <p>{getCategoryLabel(product.code)}</p>
        </div>

        <div className="justify-self-end">
          <h3 className="text-sm font-medium text-gray-500 text-right">
            {t("product.details.price")}
          </h3>
          <p>{product.price?.toLocaleString()} {t("product.card.gs")}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 ">{t("product.details.category")}</h3>
          <p>{getCategoryLabel(product.category)}</p>
        </div>

        <div className="justify-self-end">
          <h3 className="text-sm font-medium text-gray-500 text-right">
            {t("product.details.cost")}
          </h3>
          <p>{product.cost?.toLocaleString()} {t("product.card.gs")}</p>
        </div>

        <div>
          {product.tags && product.tags.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-gray-500 ">{t("product.details.tags")}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-md border border-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="justify-self-end">
          <h3 className="text-sm font-medium text-gray-500 text-right">
           {t("product.details.quantity")}
          </h3>
          <p className="text-right">
            {isStockLoading ? <ProductDetailSkeleton/>: product.quantity.toString()}
          </p>
        </div>
        <div />
      </div>
    </div>
  );
};

export default ProductInfo;