"use client";

import { useEffect, useState } from "react";
import ProductSearch from "../depositUI/ProductSearch";

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface ProductDetail {
  productId: number;
  amount: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  imageUrl: string | null;
  stock: number;
}

interface Props {
  token: string;
  depositoId: number;
}

const formatNumber = (num: number) => num.toLocaleString("es-ES");

const ProductList: React.FC<Props> = ({ token, depositoId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              category: productData.category,
              price: productData.price,
              cost: productData.cost,
              imageUrl: productData.image?.previewUrl || null,
              stock: detail.amount,
            };
          })
        );

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, depositoId, token]);

  const handleSearch = (query: string) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <ProductSearch onSearch={handleSearch} />
      {filteredProducts.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg flex gap-4 items-center">
          <img
            src={product.imageUrl || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div>
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">Categoría: {product.category}</p>
            <p>Precio: {formatNumber(product.price)} Gs.</p>
            <p>Costo: {formatNumber(product.cost)} Gs.</p>
            <p>Stock: {formatNumber(product.stock)}</p>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded ${currentPage === page ? "bg-gray-400" : "bg-gray-200"}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
