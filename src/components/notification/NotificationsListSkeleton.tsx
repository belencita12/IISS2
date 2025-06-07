import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsListSkeleton() {
  return Array.from({ length: 5 }, (_, index) => (
    <Card
      key={index}
      className="animate-pulse relative transition-all duration-300 overflow-hidden rounded-lg shadow-md bg-white border border-gray-200"
    >
      <CardHeader className="flex flex-row items-start justify-between p-2 pb-0">
        <div className="flex-1 pr-2">
          <CardTitle className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1">
            <Skeleton className="h-3 w-11/12 mb-0.5" />
          </CardTitle>
          <CardDescription className="text-xs text-gray-600 line-clamp-2">
            <Skeleton className="h-3 w-10/12" />
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
          <Skeleton className="h-3.5 w-[50px]" />
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <Skeleton className="h-3 w-full mb-0.5" />
        <Skeleton className="h-3 w-10/12" />
      </CardContent>
      <CardFooter className="flex justify-end p-2 pt-0">
        <Skeleton className="h-7 w-[80px] rounded-md" />
      </CardFooter>
    </Card>
  ));
}
