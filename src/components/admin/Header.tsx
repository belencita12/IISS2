import { Avatar } from "@/components/ui/avatar";
import { Globe } from "lucide-react"; 

interface HeaderProps {
    fullName?: string;
}

export const Header = ({ fullName }: HeaderProps) => {
    return (
        <div className="bg-[#606060] p-6 flex items-center text-white w-full">
            <Avatar className="w-20 h-20 flex items-center justify-center rounded-full bg-white">
                <Globe className="w-20 h-20 text-black" />
                <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 bg-yellow-400 text-black font-bold py-1 text-xs text-center">
                        ADMIN
                </div>
            </Avatar>
            <div className="ml-4 flex-1">
                <h2 className="text-xl font-bold mt-2">{fullName}</h2>
                <p className="text-base mt-1">Bienvenido al panel de administración</p>
            </div>
        </div>
    );
};
