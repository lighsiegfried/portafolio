import { Skeleton } from '@/mini-erp/components/ui/skeleton';

/** Loading shell for the Kanban board. */
export default function LeadsBoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden pb-2">
      {[0, 1, 2, 3, 4].map((col) => (
        <div key={col} className="flex w-72 shrink-0 flex-col gap-2">
          <Skeleton className="h-9 w-full rounded-lg" />
          {[0, 1].map((c) => (
            <Skeleton key={c} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  );
}
