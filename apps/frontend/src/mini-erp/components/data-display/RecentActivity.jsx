import { Card, CardContent, CardHeader, CardTitle } from '@/mini-erp/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/mini-erp/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/mini-erp/components/ui/table';
import StatusBadge from '../StatusBadge';
import EmptyState from '../EmptyState';
import { formatDate, formatNumber } from '../../utils/formatters';

function Empty({ message }) {
  return <EmptyState message={message} />;
}

function RequisitionsTable({ rows }) {
  if (!rows || rows.length === 0) return <Empty message="Sin requisiciones recientes" />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs text-violet-300">{r.number}</TableCell>
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
  if (!rows || rows.length === 0) return <Empty message="Sin movimientos recientes" />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Motivo</TableHead>
          <TableHead className="text-right">Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((m) => (
          <TableRow key={m.id}>
            <TableCell className={`text-xs font-bold ${m.type === 'IN' ? 'text-green-400' : 'text-red-400'}`}>{m.type}</TableCell>
            <TableCell>{formatNumber(m.quantity)}</TableCell>
            <TableCell className="max-w-[220px] truncate text-muted-foreground">{m.reason || '-'}</TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">{formatDate(m.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LeadsTable({ rows }) {
  if (!rows || rows.length === 0) return <Empty message="Sin leads recientes" />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Empresa</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((l) => (
          <TableRow key={l.id}>
            <TableCell className="max-w-[200px] truncate">{l.companyName || l.company || '-'}</TableCell>
            <TableCell className="text-muted-foreground">{l.contactName || l.name || '-'}</TableCell>
            <TableCell><StatusBadge status={l.status} /></TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">{formatDate(l.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function RecentActivity({ requisitions, movements, leads }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="requisitions">
          <TabsList>
            <TabsTrigger value="requisitions">Requisiciones</TabsTrigger>
            <TabsTrigger value="movements">Movimientos</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>
          <TabsContent value="requisitions"><RequisitionsTable rows={requisitions} /></TabsContent>
          <TabsContent value="movements"><MovementsTable rows={movements} /></TabsContent>
          <TabsContent value="leads"><LeadsTable rows={leads} /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
