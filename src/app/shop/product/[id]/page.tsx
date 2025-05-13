import ProductDetail from "@/components/product/ProductDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";

export default async function Page() {
    const session = await getServerSession(authOptions);
    const token = session?.user.token;
    return (
        <div>
            <ProductDetail token={token} />
        </div>
    );
}
