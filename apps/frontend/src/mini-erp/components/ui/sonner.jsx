import { Toaster as Sonner } from "sonner"

import { useTheme } from "@/context/ThemeContext"

/**
 * Toast host for the Mini ERP.
 *
 * The theme used to be pinned to `"dark"` because the ERP was a dark-only
 * surface. It now follows the app-wide `ThemeProvider` so toasts repaint with
 * the rest of the shell. `bg-primary` was also removed from the action button:
 * `primary` in `tailwind.config.cjs` is the *portfolio* token (the page
 * background), not the shadcn accent, so it rendered an invisible button.
 */
const Toaster = ({
  ...props
}) => {
  const { isDark } = useTheme()

  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-foreground group-[.toast]:text-background",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props} />
  );
}

export { Toaster }
