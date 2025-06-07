import { Skeleton } from "../ui/skeleton"

export default function NavbarSkeleton() {
  return (
    <header className="w-full shadow-sm px-8 py-4 bg-white border-b border-myPurple-disabled/30">
      <div className="w-full flex items-center justify-between h-full">
        <div className="flex items-center gap-2">
          <Skeleton className="w-[60px] h-[60px] rounded" />
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex gap-8 items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-18" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="md:hidden h-10 w-10 rounded-md" /> 
        </div>
      </div>
    </header>
  )
}
