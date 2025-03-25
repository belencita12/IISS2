import { useState, useCallback, useEffect } from "react";
import { getProducts } from "@/lib/admin/products/getProducts";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import { Product, ProductResponse } from "@/lib/admin/products/IProducts";

export function useProductList(token: string) {
  // Definición de tipos para los filtros
  const [searchFilters, setSearchFilters] = useState({
    code: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minCost: "",
    maxCost: "",
  });

  const [inputFilters, setInputFilters] = useState({ ...searchFilters });
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  });

  // Función para cargar el stock de un producto
  const loadProductStock = useCallback(
    async (productId: string) => {
      try {
        const stockData = await getStockDetails(productId, token);
        const totalStock = stockData.data.reduce(
          (total, detail) => total + detail.amount,
          0
        );
        return totalStock;
      } catch (error) {
        console.error(`Error al cargar el stock del producto ${productId}:`, error);
        return 0;
      }
    },
    [token]
  );

  // Función para cargar productos
  const loadProducts = useCallback(
    async (page: number, filterParams = searchFilters) => {
      setIsLoading(true);
      try {
        const params = { ...filterParams, page, size: pagination.pageSize };
        const data: ProductResponse = await getProducts(params, token);

        // Cargar el stock para cada producto
        const stockPromises = data.data.map(async (product) => {
          const productStock = await loadProductStock(product.id);
          return { id: product.id, stock: productStock };
        });

        const stockResults = await Promise.all(stockPromises);
        
        const newStockMap: Record<string, number> = {};
        stockResults.forEach(result => {
          newStockMap[result.id] = result.stock;
        });
        
        setStockMap(newStockMap);
        setProducts(data.data);
        setPagination({
          currentPage: page,
          totalPages: data.totalPages,
          totalItems: data.total,
          pageSize: data.size,
        });
      } catch (error) {
        console.error("Error al obtener productos", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchFilters, token, pagination.pageSize, loadProductStock]
  );

  // Efecto para manejar cambios en los filtros
  useEffect(() => {
    if (token) {
      setSearchFilters(inputFilters);
      loadProducts(1, inputFilters);
    }
  }, [inputFilters, token, loadProducts]);

  // Carga inicial
  useEffect(() => {
    if (token) {
      loadProducts(1);
    }
  }, [token, loadProducts]);

  // Función de búsqueda
  const handleSearch = () => {
    setSearchFilters(inputFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    loadProducts(1, inputFilters);
  };

  // Función de cambio de página
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
    loadProducts(page, searchFilters);
  };

  return {
    products,
    stockMap,
    isLoading,
    pagination,
    inputFilters,
    setInputFilters,
    handleSearch,
    handlePageChange,
  };
}