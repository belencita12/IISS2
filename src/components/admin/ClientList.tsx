import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ClientList = () => {
    return (
        <div className="p-6  mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <Input placeholder="Buscar por nombre..." className="w-full" />
                <Button variant="default">Buscar</Button>
            </div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Clientes</h2>
                <Button variant="outline" className="px-6">Agregar</Button>
            </div>
        </div>
    );
};

export default ClientList;
