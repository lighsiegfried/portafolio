import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/mini-erp/components/ui/command';
import { Button } from '@/mini-erp/components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { getVisibleNavItems, navTitle } from '../../config/navigation';
import useErpTranslation from '../../i18n/useErpTranslation';

/**
 * Client-only command palette (⌘K / Ctrl+K). Navigates between Mini ERP routes
 * the current user is allowed to see. No backend interaction.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { te } = useErpTranslation();
  const items = getVisibleNavItems(user);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const go = useCallback((url) => {
    setOpen(false);
    navigate(url);
  }, [navigate]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={te.nav.commandTrigger}
        className="h-9 gap-2 text-muted-foreground"
      >
        <Search aria-hidden="true" className="size-4" />
        <span className="hidden md:inline">{te.nav.commandTrigger}</span>
        <kbd
          aria-hidden="true"
          className="ml-2 hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] md:inline"
        >
          {te.nav.commandShortcut}
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={te.nav.commandPlaceholder} />
        <CommandList>
          <CommandEmpty>{te.nav.commandEmpty}</CommandEmpty>
          <CommandGroup heading={te.nav.commandGroupNavigation}>
            {items.map((item) => {
              const label = navTitle(te, item.titleKey);
              return (
                <CommandItem key={item.url} value={label} onSelect={() => go(item.url)}>
                  <item.icon aria-hidden="true" className="mr-2 size-4" />
                  {label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
