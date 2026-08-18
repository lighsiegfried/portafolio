import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, AlertTriangle, Wallet } from 'lucide-react';
import { getSummary } from '../../services/dashboardApi';
import { useAuth } from '../hooks/useAuth';
import useErpTranslation from '../i18n/useErpTranslation';
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
  const { te } = useErpTranslation();
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
      // Store the raw API message only; the localized fallback is resolved at
      // render time so it follows the active language without refetching.
      setError(err.message || '');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <DashboardSkeleton />;
  if (error !== null) return <ErrorState message={error || te.errors.loadDashboard} onRetry={load} />;
  if (!data) return null;

  const showInventory = userCan(user, 'viewInventory');
  const showCrm = userCan(user, 'viewLeads');
  const hasSide = showInventory || showCrm;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{te.dashboard.title}</h1>
          <p className="text-sm text-muted-foreground">{te.dashboard.subtitle}</p>
        </div>
        <QuickActions user={user} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={te.dashboard.kpi.pendingRequisitions}
          value={formatNumber(data.pendingRequisitions)}
          hint={te.dashboard.kpi.totalHint.replace('{count}', formatNumber(data.totalRequisitions))}
          icon={FileText}
          accent="yellow"
          onClick={() => navigate('/mini-erp/requisitions')}
        />
        <KpiCard
          label={te.dashboard.kpi.activeLeads}
          value={formatNumber(data.activeLeads)}
          hint={te.dashboard.kpi.totalHint.replace('{count}', formatNumber(data.totalLeads))}
          icon={Users}
          accent="cyan"
          onClick={showCrm ? () => navigate('/mini-erp/leads') : undefined}
        />
        <KpiCard
          label={te.dashboard.kpi.lowStock}
          value={formatNumber(data.lowStockProducts)}
          hint={te.dashboard.kpi.productsHint.replace('{count}', formatNumber(data.totalProducts))}
          icon={AlertTriangle}
          accent="red"
          onClick={showInventory ? () => navigate('/mini-erp/inventory') : undefined}
        />
        <KpiCard
          label={te.dashboard.kpi.inventoryValue}
          value={formatCurrency(data.totalInventoryValue)}
          icon={Wallet}
          accent="green"
        />
      </div>

      <div className={cn('grid grid-cols-1 gap-4', hasSide && 'lg:grid-cols-2')}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{te.dashboard.chart.title}</CardTitle>
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
