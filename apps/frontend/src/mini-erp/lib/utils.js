import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Shared `cn` helper used by every shadcn/ui primitive in the Mini ERP design system.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
