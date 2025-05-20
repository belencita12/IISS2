"use client";
import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/products/IProducts";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel";
import { useTranslations } from "next-intl";

const defaultImage = "/NotImageNicoPets.png";

interface StockDetailCardProps {
  product: Product;
  amount: number;
  onClick: (id: string) => void;
}

const StockDetailCard: React.FC<StockDetailCardProps> = ({ product, amount, onClick }) => {
  const p = useTranslations("ProductDetail");


  return (
    <Card
      className="overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(product.id)}
    >
      <div className="flex flex-col sm:flex-row p-4">
        <div className="w-[100px] h-[100px] mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
          <Image
            src={product.image?.originalUrl || defaultImage}
            alt={product.name}
            width={100}
            height={100}
            className="w-full h-full object-cover rounded"
          />          
        </div>
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="col-span-1 sm:col-span-2 md:col-span-3">
              <h3 className="text-lg font-semibold break-words">{product.name}</h3>
            </div>
            <div className="col-span-1 flex flex-wrap gap-1 items-start min-w-0">
              {product.tags?.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-2 py-1 text-sm text-gray-500 font-normal break-words"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">{p("name")}</p>
              <p className="text-sm text-gray-500 mt-2">{p("provider")}</p>
              <p className="text-sm text-gray-500 mt-2">{p("category")}</p>
              <p className="text-sm text-gray-500 mt-2">{p("price")}</p>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm break-words">{product.code}</p>
              <p className="text-sm mt-2 break-words">{product.provider.name}</p>
              <p className="text-sm mt-2 break-words">{getCategoryLabel(product.category)}</p>
              <p className="text-sm mt-2">{product.price.toLocaleString()} {p("gs")}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">{p("cost")}</p>
              <p className="text-sm text-gray-500 mt-2">{p("quantity")}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm">{product.cost?.toLocaleString()} {p("gs")}</p>
              <p className="text-sm mt-2">{amount}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StockDetailCard;