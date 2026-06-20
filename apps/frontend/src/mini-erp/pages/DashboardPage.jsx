import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, AlertTriangle, Wallet } from 'lucide-react';
import { getSummary } from '../../services/dashboardApi';
import { useAuth } from '../hooks/useAuth';
import { userCan } from '../utils/permissions';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/mini-erp/components/ui/card';
import { Skeleton } from '@/mini-erp/components/ui/skeleton';
import { cn } from '@/mini-erp/lib/utils';
import KpiCard from '../components/data-display/KpiCard';
import QuickActions from '../components/data-display/QuickActions';
import RecentActivity from '../components/data-display/RecentActivity';
import LowStockAlerts from '../components/data-display/LowStockAlerts';
import CrmPipeline from '../components/data-display/CrmPipeline';
import DashboardSkeleton from '../components/feedback/DashboardSkeleton';
import ErrorState from '../components/ErrorState';

const RequisitionStatusChart = lazy(() => import('../components/charts/RequisitionStatusChart'));

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSummary();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const showInventory = userCan(user, 'viewInventory');
  const showCrm = userCan(user, 'viewLeads');
  const hasSide = showInventory || showCrm;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Resumen del sistema</p>
        </div>
        <QuickActions user={user} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Reqs Pendientes"
          value={formatNumber(data.pendingRequisitions)}
          hint={`${formatNumber(data.totalRequisitions)} en total`}
          icon={FileText}
          accent="yellow"
          onClick={() => navigate('/mini-erp/requisitions')}
        />
        <KpiCard
          label="Leads Activos"
          value={formatNumber(data.activeLeads)}
          hint={`${formatNumber(data.totalLeads)} en total`}
          icon={Users}
          accent="cyan"
          onClick={showCrm ? () => navigate('/mini-erp/leads') : undefined}
        />
        <KpiCard
          label="Bajo Stock"
          value={formatNumber(data.lowStockProducts)}
          hint={`${formatNumber(data.totalProducts)} productos`}
          icon={AlertTriangle}
          accent="red"
          onClick={showInventory ? () => navigate('/mini-erp/inventory') : undefined}
        />
        <KpiCard
          label="Valor Inventario"
          value={formatCurrency(data.totalInventoryValue)}
          icon={Wallet}
          accent="green"
        />
      </div>

      <div className={cn('grid grid-cols-1 gap-4', hasSide && 'lg:grid-cols-2')}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado de requisiciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="mx-auto aspect-square max-h-[220px] w-full rounded-full" />}>
              <RequisitionStatusChart
                counts={{
                  pending: data.pendingRequisitions,
                  approved: data.approvedRequisitions,
                  completed: data.completedRequisitions,
                  rejected: data.rejectedRequisitions,
                }}
              />
            </Suspense>
          </CardContent>
        </Card>

        {showCrm && <CrmPipeline />}
        {showInventory && <LowStockAlerts />}
      </div>

      <RecentActivity
        requisitions={data.recentRequisitions}
        movements={data.recentMovements}
        leads={data.recentLeads}
      />
    </div>
  );
}
