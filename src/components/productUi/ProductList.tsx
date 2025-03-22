"use client";

import { useEffect, useState } from "react";
import ProductSearch from "../depositUI/ProductSearch";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";
import { Card, CardContent } from "../ui/card";
import { ZodNumberDef } from "zod";

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface ProductDetail {
  productId: number;
  amount: number;
}

interface Image {
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
  image: Image | null;
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

        // Agrupar productos sumando cantidades duplicadas
        const mergedDetails = productDetails.reduce((acc, detail) => {
          const key = `${detail.productId}`;
          if (!acc[key]) {
            acc[key] = { ...detail };
          } else {
            acc[key].amount += detail.amount;
          }
          return acc;
        }, {} as Record<string, ProductDetail>);

        const uniqueDetails = Object.values(mergedDetails);

        const fetchedProducts = await Promise.all(
          uniqueDetails.map(async (detail) => {
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
        <Card
        key={product.id}
        className="overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => {}}
      >
        <div className="flex flex-col sm:flex-row p-4">
          <div className="w-[100px] h-[100px] mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
            {product.image?.originalUrl ? (
              <Image
                src={product.image.originalUrl}
                alt={product.name}
                width={100}
                height={100}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                {product.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">{product.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">Código</p>
                <p className="text-sm text-gray-500 mt-2">Proveedor</p>
                <p className="text-sm text-gray-500 mt-2">Categoría</p>
                <p className="text-sm text-gray-500 mt-2">
                  Precio Unitario
                </p>
              </div>
              <div className="flex flex-col">
              <p className="text-sm">{product.code}</p>
                <p className="text-sm mt-2">La Mascota S.A.</p>
                <p className="text-sm mt-2">{product.category}</p>
                <p className="text-sm mt-2">
                  {product.price.toLocaleString()} Gs
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">Costo</p>
                <p className="text-sm text-gray-500 mt-2">Stock</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">
                  {product.cost?.toLocaleString()} Gs
                </p>
                <p className="text-sm mt-2">
                  {product.stock?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      ))}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationPrevious onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext onClick={() => {
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductList;
