"use client";

import React from "react";
import { Card } from "@/components/ui/card";

const ProductListSkeleton: React.FC = () => {
  const skeletonItems = new Array(16).fill(null); // muestra 16 elementos cargando

  return (
    <>
      {skeletonItems.map((_, index) => (
        <Card key={index} className="overflow-hidden mb-4 animate-pulse">
          <div className="flex flex-col sm:flex-row p-4">
            <div className="w-[100px] h-[100px] bg-gray-300 rounded mb-4 sm:mb-0 sm:mr-4"></div>
            <div className="flex-1 space-y-4">
              <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ProductListSkeleton;
