import { Header } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";

export default function Profile() {
    return (
        <div className="mx-auto">
            <Header />
            <PetsList />
        </div>
    );
}
