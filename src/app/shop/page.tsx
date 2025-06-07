import ProductCatalog from "@/components/product/ProductCatalog";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

export default async function Page() {
    const t = await getTranslations();
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;
    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full bg-gradient-to-r from-myPurple-tertiary to-myPink-tertiary py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {t("shop.title")}
                </h1>
                <div className="w-20 h-1 bg-white mx-auto my-6"></div>
                <p className="text-white text-lg max-w-2xl mx-auto px-4">
                    {t("shop.description")}
                </p>
            </div>
            <div className="flex-1 bg-gray-50">
                <ProductCatalog token={token} />
            </div>
        </div>
    );
}
