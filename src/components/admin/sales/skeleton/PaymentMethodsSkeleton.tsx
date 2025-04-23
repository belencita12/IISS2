import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PaymentMethodsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pago</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex-col items-end gap-4">
          <div className="flex-1 pb-4">
            {/* Radio options skeleton */}
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-2 mb-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          <div className="flex-1 flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monto</label>
              <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Método</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(2).fill(0).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}