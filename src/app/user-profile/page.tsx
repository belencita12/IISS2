import { Header } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";

export default function Dashboard() {
    return (
        <div className="mx-auto p-4">
            <Header />
            <PetsList />
        </div>
    );
}
