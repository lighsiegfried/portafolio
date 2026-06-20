import { Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/mini-erp/components/ui/chart';
import EmptyState from '../EmptyState';

const SEGMENTS = [
  { key: 'pending', label: 'Pendientes', color: 'hsl(var(--chart-4))' },
  { key: 'approved', label: 'Aprobadas', color: 'hsl(var(--chart-2))' },
  { key: 'completed', label: 'Completadas', color: 'hsl(var(--chart-3))' },
  { key: 'rejected', label: 'Rechazadas', color: 'hsl(var(--chart-5))' },
];

const chartConfig = SEGMENTS.reduce((acc, s) => {
  acc[s.key] = { label: s.label, color: s.color };
  return acc;
}, {});

/**
 * Requisition status donut. Built from the four status counts in /dashboard/summary.
 * Lazy-loaded so Recharts ships in its own chunk. All-zero -> empty state.
 */
export default function RequisitionStatusChart({ counts }) {
  const legend = SEGMENTS.map((s) => ({ ...s, value: counts[s.key] || 0 }));
  const total = legend.reduce((sum, s) => sum + s.value, 0);
  const data = legend.filter((s) => s.value > 0).map((s) => ({ name: s.label, value: s.value, fill: s.color }));

  if (total === 0) {
    return <EmptyState message="Sin requisiciones registradas" />;
  }

  return (
    <div>
      <div className="relative">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[220px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} strokeWidth={2}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} stroke="hsl(var(--card))" />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
        {legend.map((s) => (
          <div key={s.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="font-medium text-foreground">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
