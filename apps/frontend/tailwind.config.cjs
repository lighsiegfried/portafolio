/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        // --- Portfolio tokens ---------------------------------------------------
        // These used to be literal hex values baked for the dark-only portfolio.
        // They are now resolved from CSS custom properties declared in
        // `src/index.css` (`:root` = light, `.dark` = the ORIGINAL hex values),
        // so a single `.dark` class on <html> repaints the whole portfolio.
        // The `<alpha-value>` placeholder keeps opacity modifiers working
        // (`bg-primary/80`, `border-line/5`, ...).
        //
        // Dark-mode values are byte-identical to the previous palette:
        //   primary #050816 · secondary #aaa6c3 · tertiary #151030
        //   black-100 #100d25 · black-200 #090325 · white-100 #f3f3f3
        primary: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          foreground: "rgb(var(--c-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--c-secondary) / <alpha-value>)",
          foreground: "rgb(var(--c-secondary-foreground) / <alpha-value>)",
        },
        tertiary: "rgb(var(--c-tertiary) / <alpha-value>)",
        "black-100": "rgb(var(--c-black-100) / <alpha-value>)",
        "black-200": "rgb(var(--c-black-200) / <alpha-value>)",
        "white-100": "rgb(var(--c-white-100) / <alpha-value>)",

        // --- Theme-aware neutrals (new) ----------------------------------------
        // `ink` replaces literal `text-white` on portfolio copy; `line` replaces
        // literal `white/5`-style hairline borders and translucent overlays.
        // Both invert in light mode, so `text-ink` / `border-line/10` read
        // correctly on either background without per-usage `dark:` variants.
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        // Fixed accent used by hero/nav highlights — identical in both themes
        // except for a slightly darker light-mode variant for AA contrast.
        accentv: "rgb(var(--c-accent-violet) / <alpha-value>)",

        // --- shadcn/ui semantic tokens (Mini ERP) ------------------------------
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      // Tailwind's DEFAULT opacity scale is 0 5 10 20 25 30 40 50 60 70 75 80
      // 90 95 100 — it has no 15, 35, 45, 55, 65, 85. A modifier outside the
      // scale (`bg-black/65`, `bg-violet-500/15`) is silently dropped by the
      // JIT: no rule is emitted, no warning is printed, and the build still
      // passes, so the only symptom is an element that renders with no
      // background or no border at all. That bit this codebase in 12 places
      // (the Mini ERP modal scrim and every KPI tile among them).
      //
      // Filling the scale to every multiple of 5 removes the whole class of
      // bug. Utilities are still generated on demand, so unused steps cost
      // nothing in the bundle.
      opacity: Object.fromEntries(
        Array.from({ length: 21 }, (_, i) => [i * 5, String(i * 5 / 100)])
      ),
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Was `0px 35px 120px -15px #211e35` (dark-only). Now theme-driven so
        // light mode gets a soft neutral lift instead of a near-black bloom.
        card: "var(--shadow-card)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
