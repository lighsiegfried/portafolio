import { useNavigate } from 'react-router-dom';
import { FilePlus2, PackagePlus, ArrowLeftRight, UserPlus } from 'lucide-react';
import { Button } from '@/mini-erp/components/ui/button';
import { userCan } from '../../utils/permissions';
import useErpTranslation from '../../i18n/useErpTranslation';

/** `labelKey` indexes `dashboard.quickActions.*`; labels resolve at render time. */
const ACTIONS = [
  { labelKey: 'newRequisition', icon: FilePlus2, to: '/mini-erp/requisitions', permission: 'createRequisition' },
  { labelKey: 'registerMovement', icon: ArrowLeftRight, to: '/mini-erp/inventory', permission: 'createMovement' },
  { labelKey: 'newLead', icon: UserPlus, to: '/mini-erp/leads', permission: 'manageLeads' },
  { labelKey: 'newProduct', icon: PackagePlus, to: '/mini-erp/products', permission: 'createProduct' },
];

/**
 * Role-aware quick actions. Each entry navigates to the relevant page (the
 * create flow lives there). Hidden entirely when the user has no permitted action.
 */
export default function QuickActions({ user }) {
  const { te } = useErpTranslation();
  const navigate = useNavigate();
  const actions = ACTIONS.filter((a) => userCan(user, a.permission));

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, i) => (
        <Button
          key={action.to + action.labelKey}
          variant={i === 0 ? 'default' : 'outline'}
          size="sm"
          onClick={() => navigate(action.to)}
        >
          <action.icon className="size-4" aria-hidden="true" />
          {te.dashboard.quickActions[action.labelKey]}
        </Button>
      ))}
    </div>
  );
}
