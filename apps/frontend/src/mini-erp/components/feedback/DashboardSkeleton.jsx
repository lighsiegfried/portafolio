import { Card } from '@/mini-erp/components/ui/card';
import { Skeleton } from '@/mini-erp/components/ui/skeleton';

/** Loading shell matching the dashboard layout to avoid layout shift. */
export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-44" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-20" />
            <Skeleton className="mt-2 h-3 w-16" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <Skeleton className="mx-auto aspect-square max-h-[220px] w-full rounded-full" />
        </Card>
        <Card className="space-y-3 p-6">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-7 w-full" />)}
        </Card>
      </div>

      <Card className="space-y-3 p-6">
        <Skeleton className="h-8 w-64" />
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-9 w-full" />)}
      </Card>
    </div>
  );
}
