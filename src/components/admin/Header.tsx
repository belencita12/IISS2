import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  fullName: string;
}

export const Header = ({ fullName }: HeaderProps) => {
  return (
    <header className="bg-[#606060] p-2 xs:p-3 sm:p-4 md:p-6 flex items-center text-white w-full">
      <Avatar className="flex-shrink-0 w-8 h-8 xs:w-10 xs:h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 ml-1 xs:ml-2 sm:ml-6 md:ml-20">
        <AvatarImage
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt="Usuario"
        />
      </Avatar>
      <div className="ml-1 xs:ml-2 sm:ml-3 md:ml-4 flex-1">
        <h2 className="text-xs xs:text-sm sm:text-lg md:text-xl font-bold mt-0.5 sm:mt-1 md:mt-2 truncate">
          {fullName}
        </h2>
        <p className="text-[10px] xs:text-xs sm:text-sm md:text-base mt-0 xs:mt-0.5 md:mt-1 truncate">
          Bienvenido al panel de administración
        </p>
      </div>
    </header>
  );
};
