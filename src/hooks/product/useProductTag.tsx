import { useState, useCallback, useEffect } from "react";
import { getProductByTag } from "@/lib/products/getProductByTag";
import { Product } from "@/lib/products/IProducts";
import { toast } from "@/lib/toast";
import useDebounce from "@/hooks/useDebounce";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export const useProductTag = (token: string, externalPageSize: number = 5) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isTagFiltering, setIsTagFiltering] = useState(false);
  const [tagPagination, setTagPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: externalPageSize,
  });
  const [allTagProducts, setAllTagProducts] = useState<Product[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // Aplicamos debounce a los tags seleccionados
  const debouncedTags = useDebounce(selectedTags, 1000);

  useEffect(() => {
    if (externalPageSize !== tagPagination.pageSize) {
      setTagPagination(prev => {
        const newTotalPages = Math.ceil(prev.totalItems / externalPageSize);
        return {
          ...prev,
          pageSize: externalPageSize,
          totalPages: newTotalPages,
          currentPage: Math.min(prev.currentPage, newTotalPages || 1)
        };
      });
      
      updateVisibleProducts(tagPagination.currentPage);
    }
  }, [externalPageSize]);

  // Función para actualizar productos visibles en la página actual
  const updateVisibleProducts = useCallback((page: number) => {
    if (allTagProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    const startIndex = (page - 1) * tagPagination.pageSize;
    const endIndex = Math.min(startIndex + tagPagination.pageSize, allTagProducts.length);
    
    setFilteredProducts(allTagProducts.slice(startIndex, endIndex));
  }, [allTagProducts, tagPagination.pageSize]);

  // Este efecto reacciona a los cambios en debouncedTags
  useEffect(() => {
    const fetchProducts = async () => {
      if (debouncedTags.length === 0) {
        setFilteredProducts([]);
        setAllTagProducts([]);
        setIsTagFiltering(false);
        setTagPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        }));
        return;
      }

      setIsTagFiltering(true);
      try {
        const products = await getProductByTag(debouncedTags, token);
        setAllTagProducts(products);
        
        const totalPages = Math.ceil(products.length / tagPagination.pageSize);
        
        setTagPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: totalPages,
          totalItems: products.length
        }));
        
        const firstPageProducts = products.slice(0, tagPagination.pageSize);
        setFilteredProducts(firstPageProducts);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error al filtrar productos por etiquetas.";
        console.error("Error al filtrar por tags:", error);
        toast("error", errorMessage); 
        setFilteredProducts([]);
        setAllTagProducts([]);
        setTagPagination(prev => ({
          ...prev,
          currentPage: 1, 
          totalPages: 1,
          totalItems: 0
        }));
      } finally {
        setIsTagFiltering(false);
      }
    };

    fetchProducts();
  }, [debouncedTags, token, tagPagination.pageSize]);

  // Función para actualizar los tags seleccionados
  const fetchFilteredProducts = useCallback((tags: string[]) => {
    setSelectedTags(tags);
    if (tags.length > 0) {
      setIsTagFiltering(true);
    }
  }, []);

  // Función para calcular la paginación basada en productos filtrados
  const recalculatePagination = useCallback((filteredProductsLength: number) => {
    const totalPages = Math.ceil(filteredProductsLength / tagPagination.pageSize);
    setTagPagination(prev => ({
      ...prev,
      totalPages: totalPages || 1,
      totalItems: filteredProductsLength,
      currentPage: Math.min(prev.currentPage, totalPages || 1)
    }));
  }, [tagPagination.pageSize]);

  // Manejar cambio de página para filtros de tags
  const handleTagPageChange = useCallback((page: number) => {
    if (page < 1 || page > tagPagination.totalPages) return;
    
    setTagPagination(prev => ({
      ...prev,
      currentPage: page
    }));
    
    updateVisibleProducts(page);
  }, [tagPagination.totalPages, updateVisibleProducts]);

  // Función para sincronizar el tamaño de página
  const syncPageSize = useCallback((size: number) => {
    setTagPagination(prev => {
      const newTotalPages = Math.ceil(prev.totalItems / size);
      return {
        ...prev,
        pageSize: size,
        totalPages: newTotalPages,
        currentPage: Math.min(prev.currentPage, newTotalPages || 1)
      };
    });
    
    setTimeout(() => {
      updateVisibleProducts(tagPagination.currentPage);
    }, 0);
  }, [tagPagination.currentPage, updateVisibleProducts]);

  // Obtener IDs de productos para intersección
  const getFilteredProductIds = useCallback(() => {
    return new Set(allTagProducts.map(product => product.id));
  }, [allTagProducts]);

  return { 
    filteredProducts, 
    isTagFiltering, 
    fetchFilteredProducts,
    tagPagination,
    handleTagPageChange,
    syncPageSize,
    selectedTags,
    getFilteredProductIds,
    recalculatePagination
  };
};