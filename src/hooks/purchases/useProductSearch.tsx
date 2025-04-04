import { useState, useEffect, useCallback } from "react";
import { Product, ProductQueryParams } from "@/lib/products/IProducts";
import { getProducts } from "@/lib/products/getProducts";

interface ExtendedProductQueryParams extends ProductQueryParams {
  name?: string;
}

export const useProductSearch = (token: string) => {
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  const fetchProducts = useCallback(async (query: string) => {
    const params: ExtendedProductQueryParams = {
      page: 1,
      size: 10,
      name: query,
    };
    const res = await getProducts(params, token);
    setSearchProducts(res.data);
  }, [token]);

  useEffect(() => {
    if (searchQuery) {
      fetchProducts(searchQuery);
    } else {
      setSearchProducts([]);
    }
  }, [searchQuery, fetchProducts]);

  const handleSearchProduct = (query: string) => {
    setSearchQuery(query);
  };

  return {
    searchProducts,
    handleSearchProduct,
    quantity,
    setQuantity,
  };
};
