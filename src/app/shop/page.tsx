import ProductCatalog from "@/components/product/ProductCatalog";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";

export default async function Page() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;
    return (
        <div className="mx-auto">
            <ProductCatalog token={token} />
        </div>
    );
}
