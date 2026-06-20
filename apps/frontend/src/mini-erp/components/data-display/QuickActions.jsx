import { useNavigate } from 'react-router-dom';
import { FilePlus2, PackagePlus, ArrowLeftRight, UserPlus } from 'lucide-react';
import { Button } from '@/mini-erp/components/ui/button';
import { userCan } from '../../utils/permissions';

const ACTIONS = [
  { label: 'Nueva requisición', icon: FilePlus2, to: '/mini-erp/requisitions', permission: 'createRequisition' },
  { label: 'Registrar movimiento', icon: ArrowLeftRight, to: '/mini-erp/inventory', permission: 'createMovement' },
  { label: 'Nuevo lead', icon: UserPlus, to: '/mini-erp/leads', permission: 'manageLeads' },
  { label: 'Nuevo producto', icon: PackagePlus, to: '/mini-erp/products', permission: 'createProduct' },
];

/**
 * Role-aware quick actions. Each entry navigates to the relevant page (the
 * create flow lives there). Hidden entirely when the user has no permitted action.
 */
export default function QuickActions({ user }) {
  const navigate = useNavigate();
  const actions = ACTIONS.filter((a) => userCan(user, a.permission));

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, i) => (
        <Button
          key={action.to + action.label}
          variant={i === 0 ? 'default' : 'outline'}
          size="sm"
          onClick={() => navigate(action.to)}
        >
          <action.icon className="size-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
