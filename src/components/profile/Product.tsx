import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package } from "lucide-react";
import urls from "@/lib/urls";

const products = [
    {
        id: 1,
        name: "Alimento Premium para Perros",
        price: "$50",
        image: "https://purina.com.py/sites/default/files/2023-06/adulto_perro_pollo_alimento_humedo_frente_pro_plan.png.webp",
    },
    {
        id: 2,
        name: "Collar Antipulgas y Garrapatas Seresto",
        price: "$20",
        image: "https://myfamilypet.com.gt/wp-content/uploads/2022/12/150507_1400x-1024x1024.webp",
    },
    {
        id: 3,
        name: "Juguete Interactivo para Perros",
        price: "$15",
        image: "https://pawshop.cl/cdn/shop/files/aa34eb88d4ed61333ea6b930ea71ba38_0199e5b7-5fad-4323-b188-5e4a0468bbac.png?v=1731268421",
    },
];

export const VeterinaryProducts = () => {
    return (
        <section className="max-w-5xl mx-auto mt-10 p-6 bg-white">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Productos Veterinarios</h2>
                <p className="text-gray-600 mt-2">Explora los productos disponibles</p>
                <Button asChild className="mt-2">
                    <Link href={urls.TIENDA}>Ver más</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {products.map((product) => (
                    <Card key={product.id} className="shadow-lg rounded-lg overflow-hidden">
                        <div className="relative w-full h-56">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                style={{ objectFit: "cover" }} 
                            />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-xl font-bold mt-1">{product.price}</p>
                            <div className="flex items-center gap-2 text-gray-500 mt-2">
                                <ShoppingCart className="w-5 h-5" />
                                <Package className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};