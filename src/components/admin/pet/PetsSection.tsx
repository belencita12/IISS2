import { Button } from "@/components/ui/button";
import PetsTable from "./PetsTable";

export default function PetsSection() { 
    return (
        <section className="mx-auto px-24">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">Mascotas</h2>
            <Button variant={"outline"} className="border-black border-solid">Agregar</Button>
        </div>
        <PetsTable />
    </section>
);
}