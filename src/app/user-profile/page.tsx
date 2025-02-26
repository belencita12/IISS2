import { Appointments } from "@/components/profile/Appointments";
import { Header } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";
import { VeterinaryProducts } from "@/components/profile/Product";

export default function Profile() {
    return (
        <div className="mx-auto">
            <Header />
            <PetsList />
            <Appointments/>
            <VeterinaryProducts />
        </div>
    );
}
