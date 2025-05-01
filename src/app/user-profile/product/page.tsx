import ProductCatalog from "@/components/product/ProductCatalog";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session?.user?.token || null;

    return (
        <div className="mx-auto">
            <ProductCatalog token={token} />
        </div>
    );
}
