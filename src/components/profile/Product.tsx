import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package } from "lucide-react";


const products = [
    {
        id: 1,
        name: "Alimento Premium",
        price: "$50",
        image: "https://cdn2.thedogfoodadvisor.com/wp-content/uploads/2023/06/Purina-Pro-Plan-Adult.jpg",
    },
    {
        id: 2,
        name: "Collar Antipulgas",
        price: "$20",
        image: "https://http2.mlstatic.com/D_NQ_NP_927452-MLA69496731971_052023-O.webp",
    },
    {
        id: 3,
        name: "Juguete Interactivo",
        price: "$15",
        image: "https://m.media-amazon.com/images/I/71+AH6yxPXL.jpg",
    },
];

export const VeterinaryProducts = () => {
    return (
        <section className="max-w-6xl mx-auto mt-10 p-6 bg-white">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Productos Veterinarios</h2>
                <p className="text-gray-600 mt-2">Explora los productos disponibles</p>
                <Button asChild className="mt-2">
                <Link href="/">Ver más</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {products.map((product) => (
                    <Card key={product.id} className="shadow-lg rounded-lg overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-56 object-cover"
                        />
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
