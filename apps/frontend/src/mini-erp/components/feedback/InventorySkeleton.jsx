import { Skeleton } from '@/mini-erp/components/ui/skeleton';

/** Loading shell for the inventory page (summary cards + movements table). */
export default function InventorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-9 w-full max-w-xs rounded-md" />
        <div className="overflow-hidden rounded-xl border border-border">
          <Skeleton className="h-10 w-full rounded-none" />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <Skeleton key={r} className="mt-px h-12 w-full rounded-none" />
          ))}
        </div>
      </div>
    </div>
  );
}
