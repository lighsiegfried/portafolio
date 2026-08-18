import useErpTranslation from '../i18n/useErpTranslation';

/**
 * Status pill for requisitions (pending/approved/rejected/completed) and leads
 * (new/in_contact/negotiation/won/lost). Accents carry a light and a dark shade
 * so the pill reads on a white card and on a near-black one.
 */
const STYLES = {
  pending: 'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300',
  approved: 'bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300',
  rejected: 'bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300',
  completed: 'bg-green-500/10 text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-300',
  new: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300',
  in_contact: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300',
  negotiation: 'bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300',
  won: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300',
  lost: 'bg-muted text-muted-foreground border-border',
};

const NEUTRAL_STYLE = 'bg-muted text-muted-foreground border-border';

export default function StatusBadge({ status }) {
  const { te } = useErpTranslation();
  const style = STYLES[status] || NEUTRAL_STYLE;
  const label = te.status.requisition[status] || te.status.lead[status] || status;
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${style}`}>
      {label}
    </span>
  );
}
