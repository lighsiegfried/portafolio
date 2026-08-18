import { Card, CardContent, CardHeader, CardTitle } from '@/mini-erp/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/mini-erp/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/mini-erp/components/ui/table';
import StatusBadge from '../StatusBadge';
import EmptyState from '../EmptyState';
import { formatDate, formatNumber } from '../../utils/formatters';
import useErpTranslation from '../../i18n/useErpTranslation';

function Empty({ message }) {
  return <EmptyState message={message} />;
}

function RequisitionsTable({ rows }) {
  const { te } = useErpTranslation();
  const cols = te.dashboard.activity.requisitions.columns;
  if (!rows || rows.length === 0) return <Empty message={te.dashboard.activity.requisitions.empty} />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{cols.number}</TableHead>
          <TableHead>{cols.title}</TableHead>
          <TableHead>{cols.status}</TableHead>
          <TableHead className="text-right">{cols.date}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs text-violet-600 dark:text-violet-300">{r.number}</TableCell>
            <TableCell className="max-w-[220px] truncate">{r.title}</TableCell>
            <TableCell><StatusBadge status={r.status} /></TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function MovementsTable({ rows }) {
  const { te } = useErpTranslation();
  const cols = te.dashboard.activity.movements.columns;
  if (!rows || rows.length === 0) return <Empty message={te.dashboard.activity.movements.empty} />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{cols.type}</TableHead>
          <TableHead>{cols.quantity}</TableHead>
          <TableHead>{cols.reason}</TableHead>
          <TableHead className="text-right">{cols.date}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((m) => (
          <TableRow key={m.id}>
            <TableCell className={`text-xs font-bold ${m.type === 'IN' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {te.inventory.movementTypes[m.type] || m.type}
            </TableCell>
            <TableCell>{formatNumber(m.quantity)}</TableCell>
            <TableCell className="max-w-[220px] truncate text-muted-foreground">{m.reason || te.formats.emptyValue}</TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">{formatDate(m.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LeadsTable({ rows }) {
  const { te } = useErpTranslation();
  const cols = te.dashboard.activity.leads.columns;
  const dash = te.formats.emptyValue;
  if (!rows || rows.length === 0) return <Empty message={te.dashboard.activity.leads.empty} />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{cols.company}</TableHead>
          <TableHead>{cols.contact}</TableHead>
          <TableHead>{cols.status}</TableHead>
          <TableHead className="text-right">{cols.date}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((l) => (
          <TableRow key={l.id}>
            <TableCell className="max-w-[200px] truncate">{l.companyName || l.company || dash}</TableCell>
            <TableCell className="text-muted-foreground">{l.contactName || l.name || dash}</TableCell>
            <TableCell><StatusBadge status={l.status} /></TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">{formatDate(l.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function RecentActivity({ requisitions, movements, leads }) {
  const { te } = useErpTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{te.dashboard.activity.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="requisitions">
          <TabsList>
            <TabsTrigger value="requisitions">{te.dashboard.activity.tabs.requisitions}</TabsTrigger>
            <TabsTrigger value="movements">{te.dashboard.activity.tabs.movements}</TabsTrigger>
            <TabsTrigger value="leads">{te.dashboard.activity.tabs.leads}</TabsTrigger>
          </TabsList>
          <TabsContent value="requisitions"><RequisitionsTable rows={requisitions} /></TabsContent>
          <TabsContent value="movements"><MovementsTable rows={movements} /></TabsContent>
          <TabsContent value="leads"><LeadsTable rows={leads} /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
