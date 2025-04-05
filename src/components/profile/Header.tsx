import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IUserProfile } from "@/lib/client/IUserProfile";

  
interface HeaderProps {
    user: IUserProfile;
}


export const Header = ({ user }: HeaderProps) => {
    const avatarSrc = 
        user.image?.originalUrl ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    return (
        <div className="bg-[#606060] p-6 flex items-center text-white">
            <Avatar className="w-20 h-20 ml-20">
                <AvatarImage src={avatarSrc} alt={user.fullName} />
            </Avatar>
            <div className="ml-4">
                <h2 className="text-xl font-bold mt-2">{user.fullName}</h2>
                <Badge className="bg-gray-300 text-black text-sm mt-2 hover:bg-gray-300">
                    Veterinaria Cliente Fiel
                </Badge>
                <p className="text-base mt-2">Bienvenido a nuestro sistema de veterinaria</p>
            </div>
        </div>
    );
};
