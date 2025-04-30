"use client";

import React from "react";
import { Card } from "@/components/ui/card";

const ProductListSkeleton: React.FC = () => {
  const skeletonItems = new Array(16).fill(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skeletonItems.map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden animate-pulse shadow rounded-lg"
        >
          <div className="flex flex-col p-3">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/4 h-56 bg-gray-200 rounded mb-3 md:mb-0 md:mr-4" />
              <div className="flex-1 flex flex-col">
                <div className="flex mb-2 gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>

                <div className="h-7 bg-gray-300 rounded mb-3 w-3/4" />

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[0, 1].map((col) => (
                    <div key={col} className="space-y-2">
                      {[0, 1, 2].map((row) => (
                        <div key={row}>
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
                          <div className="h-5 bg-gray-300 rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="h-10 bg-gray-300 rounded w-full" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductListSkeleton;
