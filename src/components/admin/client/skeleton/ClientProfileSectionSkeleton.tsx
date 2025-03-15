import { Skeleton } from "@/components/ui/skeleton";

export default function ClientProfileSectionSkeleton() {
  return (
    <section className="flex flex-wrap items-center gap-4 px-16 mx-auto md:gap-16 md:px-24 py-12">
      <Skeleton className="rounded-full w-[250px] h-[250px]" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
    </section>
  );
}