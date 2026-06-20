import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/mini-erp/components/ui/dropdown-menu';
import { Button } from '@/mini-erp/components/ui/button';
import { Badge } from '@/mini-erp/components/ui/badge';
import { useAuth } from '../../hooks/useAuth';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const name = user.name || user.username || 'Usuario';
  const initial = name.charAt(0).toUpperCase();
  const role = (user.role || '').toUpperCase();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/20 text-xs font-semibold text-[hsl(var(--primary-hover))]">
            {initial}
          </span>
          <span className="hidden text-left text-sm leading-tight sm:block">{name}</span>
          <ChevronsUpDown className="hidden size-4 text-muted-foreground sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 p-1.5 shadow-2xl">
        <DropdownMenuLabel className="font-normal px-2 py-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">{name}</span>
            <div>
              <Badge variant="secondary" className="text-[10px]">{role}</Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-300 focus:text-red-200">
          <LogOut className="size-4" />
          Salir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
