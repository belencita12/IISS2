import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
    fullName: string;
}

export const Header = ({ fullName }: HeaderProps) => {
    return (
        <div className="bg-[#606060] p-6 flex items-center text-white w-full">
            <Avatar className="w-20 h-20 ml-20">
                <AvatarImage src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Usuario" />
            </Avatar>
            <div className="ml-4 flex-1">
                <h2 className="text-xl font-bold mt-2">{fullName}</h2>
                <p className="text-base mt-1">Bienvenido al panel de administración</p>
            </div>
        </div>
    );
};
