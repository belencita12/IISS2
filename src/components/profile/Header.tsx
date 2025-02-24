import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const Header = () => {
    return (
        <div className="bg-gray-600 p-4 rounded-lg flex items-center justify-between text-white">
            <div className="flex items-center">
                <Avatar className="w-16 h-16">
                    <AvatarImage src="/avatar.jpg" alt="Veterinario" />
                </Avatar>
                <div className="ml-4">
                    <h2 className="text-lg font-bold">Fulano Mengano</h2>
                    <p className="text-sm text-gray-300">Bienvenido a nuestro sistema de veterinaria</p>
                </div>
            </div>
        </div>
    );
};


