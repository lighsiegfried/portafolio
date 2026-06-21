import { Skeleton } from '@/mini-erp/components/ui/skeleton';

/** Loading shell for the requisitions table. */
export default function RequisitionsTableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-full max-w-xs rounded-md" />
      </div>
      <div className="erp-surface-card overflow-hidden rounded-xl">
        <Skeleton className="h-10 w-full rounded-none" />
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <Skeleton key={r} className="mt-px h-12 w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}
