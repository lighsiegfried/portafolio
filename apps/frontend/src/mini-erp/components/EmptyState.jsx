import { Button } from '@/mini-erp/components/ui/button';

/**
 * Empty state. `message` alone keeps the original behavior; optionally pass a
 * `title`, an `icon`, and a contextual `action` ({ label, icon, onClick }) to
 * guide the user toward the next useful step.
 */
export default function EmptyState({ message, title, icon: Icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted/50">
        {Icon ? <Icon className="size-5 text-muted-foreground" /> : <span className="text-xl text-muted-foreground">-</span>}
      </div>
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      <p className="mt-0.5 max-w-sm text-sm">{message || 'Sin datos'}</p>
      {action && (
        <Button size="sm" className="mt-4" onClick={action.onClick}>
          {action.icon && <action.icon className="size-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
