import { Skeleton } from "../ui/skeleton";

export default function NavbarSkeleton() {
  return (
    <header className="w-full shadow-sm px-8 py-4 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="w-[75px] h-[75px] rounded" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Desktop Menu Skeleton */}
        <div className="hidden md:flex gap-8 items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-18" />
        </div>

        {/* Mobile Menu Button Skeleton */}
        <Skeleton className="md:hidden h-10 w-10" />
      </div>
    </header>
  );
}