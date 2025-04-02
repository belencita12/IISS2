import { useState, useCallback, useEffect } from "react";
import { getProductByTag } from "@/lib/products/getProductByTag";
import { Product } from "@/lib/products/IProducts";
import { toast } from "@/lib/toast";
import useDebounce from "@/hooks/useDebounce";

export const useProductTag = (token: string) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isTagFiltering, setIsTagFiltering] = useState(false);
  // Añadimos estado de paginación específico para tags
  const [tagPagination, setTagPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  });
  // Almacenamos todos los productos filtrados para manejar la paginación localmente
  const [allTagProducts, setAllTagProducts] = useState<Product[]>([]);
  // Almacenamos los tags seleccionados internamente
  const [tags, setTags] = useState<string[]>([]);
  // Aplicamos debounce a los tags seleccionados
  const debouncedTags = useDebounce(tags, 1000);

  // Este efecto reacciona a los cambios en debouncedTags
  useEffect(() => {
    const fetchProducts = async () => {
      if (debouncedTags.length === 0) {
        setFilteredProducts([]);
        setAllTagProducts([]);
        setIsTagFiltering(false);
        setTagPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          pageSize: 5,
        });
        return;
      }

      setIsTagFiltering(true);
      try {
        const products = await getProductByTag(debouncedTags, token);
        
        // Guardamos todos los productos para la paginación local
        setAllTagProducts(products);
        
        // Calculamos la paginación inicial
        const totalPages = Math.ceil(products.length / tagPagination.pageSize);
        
        // Aplicamos la primera página
        const firstPageProducts = products.slice(0, tagPagination.pageSize);
        setFilteredProducts(firstPageProducts);
        
        // Actualizamos el estado de paginación
        setTagPagination({
          currentPage: 1,
          totalPages: totalPages,
          totalItems: products.length,
          pageSize: 5,
        });
      } catch (error) {
        console.error("Error al filtrar por tags:", error);
        toast("error", "Error al filtrar productos por etiquetas");
        setFilteredProducts([]);
        setAllTagProducts([]);
      } finally {
        setIsTagFiltering(false);
      }
    };

    fetchProducts();
  }, [debouncedTags, token, tagPagination.pageSize]);

  // Función que actualiza los tags seleccionados
  const fetchFilteredProducts = useCallback((selectedTags: string[]) => {
    setTags(selectedTags);
    // La actualización real se realizará cuando debouncedTags cambie
    // Mostramos el indicador de carga inmediatamente
    if (selectedTags.length > 0) {
      setIsTagFiltering(true);
    }
  }, []);

  // Maneja cambios de página para productos filtrados por etiqueta
  const handleTagPageChange = useCallback((page: number) => {
    if (page < 1 || page > tagPagination.totalPages) return;
    
    const startIndex = (page - 1) * tagPagination.pageSize;
    const endIndex = Math.min(startIndex + tagPagination.pageSize, allTagProducts.length);
    
    // Actualizamos los productos mostrados para la página actual
    setFilteredProducts(allTagProducts.slice(startIndex, endIndex));
    
    // Actualizamos el número de página actual
    setTagPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }, [allTagProducts, tagPagination.totalPages, tagPagination.pageSize]);

  // Actualiza el tamaño de página si cambia en la aplicación
  const setTagPageSize = useCallback((size: number) => {
    setTagPagination(prev => {
      const newTotalPages = Math.ceil(prev.totalItems / size);
      return {
        ...prev,
        pageSize: size,
        totalPages: newTotalPages,
        // Aseguramos que la página actual siga siendo válida
        currentPage: Math.min(prev.currentPage, newTotalPages || 1)
      };
    });
    
    // Recalculamos los productos para la página actual con el nuevo tamaño
    setTimeout(() => {
      handleTagPageChange(tagPagination.currentPage);
    }, 0);
  }, [handleTagPageChange, tagPagination.currentPage]);

  return { 
    filteredProducts, 
    isTagFiltering, 
    fetchFilteredProducts,
    tagPagination,
    handleTagPageChange,
    setTagPageSize
  };
};