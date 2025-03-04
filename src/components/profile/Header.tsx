import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
    fullName?: string;
}

export const Header = ({ fullName }: HeaderProps) => {
    return (
        <div className="bg-[#606060] p-6 flex items-center text-white justify-center">
            <Avatar className="w-20 h-20">
                <AvatarImage src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8" alt="Veterinario" />
            </Avatar>
            <div className="ml-4">
                <h2 className="text-xl font-bold mt-2">{fullName}</h2>
                <Badge className="bg-gray-300 text-black text-sm mt-2">Veterinaria Cliente Fiel</Badge>
                <p className="text-base mt-2">Bienvenido a nuestro sistema de veterinaria</p>
            </div>
        </div>
    );
};




