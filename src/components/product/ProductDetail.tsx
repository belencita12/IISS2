"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/lib/products/getProductById";
import { getProducts } from "@/lib/products/getProducts";
import type { Product } from "@/lib/products/IProducts";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Tag } from "lucide-react";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import { Card } from "@/components/product/ProductCardCliente";
import ProductDetailSkeleton from "@/components/product/ProductDetailSkeleton";

interface Props {
    token: string;
}

export default function ProductDetailPage({ token }: Props) {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product>();
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!token) return;
            if (!id || Array.isArray(id)) return notFound();

            try {
                setLoading(true);
                const prod = await getProductById(id, token);
                setProduct(prod);

                if (prod.tags && prod.tags.length > 0) {
                    const filters = {
                        page: 1,
                        size: 16,
                        category: "",
                        minPrice: "",
                        maxPrice: "",
                        tags: prod.tags,
                        search: "",
                    };
                    const response = await getProducts(filters, token);
                    const filtered = response.data.filter(
                        (p) => p.id !== prod.id
                    );
                    setRelatedProducts(filtered);
                }
            } catch (error) {
                notFound();
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, token]);

    if (loading) {
        return <ProductDetailSkeleton />;
    }

    if (!product) return notFound();

    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="flex items-center text-purple-600 hover:text-purple-900 pl-0"
                        onClick={() => router.push("/user-profile/product")}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span>Volver a productos</span>
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
                            <div className="relative w-full aspect-square max-w-md">
                                <Image
                                    src={
                                        product.image?.originalUrl?.trim() ||
                                        NotImageNicoPets.src
                                    }
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-gray-50 rounded-lg m-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-0.5">
                                    </div>
                                </div>

                                <p className="text-gray-700 font-medium mb-6">
                                    {product.description}
                                </p>

                                <p className="text-purple-700 text-3xl font-bold mb-6">
                                    Gs. {product.price.toLocaleString()}
                                </p>

                                {product.tags && product.tags.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium mb-2 flex items-center text-gray-700">
                                            <Tag className="h-4 w-4 mr-1" />
                                            Etiquetas
                                        </h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {product.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6 text-purple-700">
                            Productos relacionados
                        </h2>
                        <div className="flex flex-wrap justify-center sm:justify-start -mx-2">
                            {relatedProducts
                                .slice(0, 4)
                                .map((relatedProduct) => (
                                    <Card
                                        key={relatedProduct.id}
                                        title={relatedProduct.name}
                                        image={
                                            relatedProduct.image?.originalUrl ??
                                            NotImageNicoPets.src
                                        }
                                        price={`Gs. ${relatedProduct.price.toLocaleString()}`}
                                        alt={relatedProduct.name}
                                        ctaText="Ver producto"
                                        ctaLink={`/user-profile/product/${relatedProduct.id}`}
                                        layout="vertical"
                                        imagePosition="top"
                                        showButton={true}
                                        tags={relatedProduct.tags || []}
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
