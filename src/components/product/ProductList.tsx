import { useEffect, useState } from "react"; 
import DepositInfo from "../deposit/DepositInfo";
import ProductFilters from "../admin/product/filter/ProductFilter";
import ProductStockCard from "./ProductStockCard";
import GenericPagination from "@/components/global/GenericPagination";

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface ProductDetail {
  productId: number;
  amount: number;
}

interface ImageType {
  id: number;
  previewUrl: string;
  originalUrl: string;
}

interface Product {
  id: number;
  name: string;
  code: string;
  cost: number;
  iva: number;
  category: string;
  price: number;
  image: ImageType | null;
  stock: number;
}

interface Props {
  token: string;
  depositoId: number;
}

const ProductList: React.FC<Props> = ({ token, depositoId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    code: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minCost: "",
    maxCost: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const codeMatch = filters.code === "" || product.code.toLowerCase().includes(filters.code.toLowerCase());
      const categoryMatch = filters.category === "" || product.category === filters.category;
      const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
      const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
      const priceMatch = (minPrice === null || product.price >= minPrice) && (maxPrice === null || product.price <= maxPrice);
      const minCost = filters.minCost ? Number(filters.minCost) : null;
      const maxCost = filters.maxCost ? Number(filters.maxCost) : null;
      const costMatch = (minCost === null || product.cost >= minCost) && (maxCost === null || product.cost <= maxCost);
  
      return codeMatch && categoryMatch && priceMatch && costMatch;
    });
    setFilteredProducts(filtered);
  }, [filters, products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/stock-details?page=${currentPage}&stockId=${depositoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        const productDetails: ProductDetail[] = data.data;

        const fetchedProducts = await Promise.all(
          productDetails.map(async (detail) => {
            const productRes = await fetch(`${apiUrl}/product/${detail.productId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!productRes.ok) {
              throw new Error("Error al obtener detalles del producto");
            }
            const productData = await productRes.json();
            return {
              id: productData.id,
              name: productData.name,
              code: productData.code,
              cost: productData.cost,
              iva: productData.iva,
              category: productData.category,
              price: productData.price,
              image: productData.image || null,
              stock: detail.amount,
            };
          })
        );

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setTotalPages(data.totalPages);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, depositoId, token]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  const preventInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e") e.preventDefault();
  };

  const onTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={() => {}}
        preventInvalidKeys={preventInvalidKeys}
        selectedTags={selectedTags}
        onTagsChange={onTagsChange}
        token={token}
      />

      <div className="pt-3 pb-3 m-4">
        <DepositInfo token={token} depositoId={depositoId} />
      </div>

      {filteredProducts.map((product) => (
        <ProductStockCard key={product.id} product={product} />
      ))}

      <GenericPagination
        handlePreviousPage={handlePreviousPage}
        handlePageChange={handlePageChange}
        handleNextPage={handleNextPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ProductList;
