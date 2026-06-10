/** @type {import('tailwindcss').Config} */
// JOBZE design-token system. Every value below is a thin map onto a CSS custom
// property defined in src/styles/tokens.css. The CSS variables are the single
// source of truth; Tailwind only exposes them as utilities. (Same pattern Cursor
// uses: tokens live in CSS, the theme just references them.)
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // Spacing is the full scale, not extend, so the token steps are the system.
    spacing: {
      0: "0",
      px: "1px",
      1: "var(--space-1)", // 4px
      2: "var(--space-2)", // 8px
      3: "var(--space-3)", // 12px
      4: "var(--space-4)", // 16px
      5: "var(--space-5)", // 20px
      6: "var(--space-6)", // 24px
      7: "var(--space-7)", // 32px
      8: "var(--space-8)", // 48px
    },
    borderRadius: {
      none: "0",
      xs: "var(--radius-xs)", // 4px
      sm: "var(--radius-sm)", // 6px
      md: "var(--radius-md)", // 8px
      lg: "var(--radius-lg)", // 12px
      pill: "var(--radius-pill)", // 999px
      full: "9999px",
    },
    fontSize: {
      xs: ["var(--text-xs)", { lineHeight: "var(--leading-xs)" }],
      sm: ["var(--text-sm)", { lineHeight: "var(--leading-sm)" }],
      base: ["var(--text-base)", { lineHeight: "var(--leading-base)" }],
      md: ["var(--text-md)", { lineHeight: "var(--leading-md)" }],
      lg: ["var(--text-lg)", { lineHeight: "var(--leading-lg)" }],
      "display-sm": ["var(--text-display-sm)", { lineHeight: "var(--leading-display-sm)" }],
      "display-md": ["var(--text-display-md)", { lineHeight: "var(--leading-display-md)" }],
      "display-lg": ["var(--text-display-lg)", { lineHeight: "var(--leading-display-lg)" }],
    },
    extend: {
      colors: {
        "jz-bg": "var(--jz-bg)",
        "jz-surface": "var(--jz-surface)",
        "jz-fg": "var(--jz-fg)",
        "jz-fg-dim": "var(--jz-fg-dim)",
        "jz-muted": "var(--jz-muted)",
        "jz-border": "var(--jz-border)",
        "jz-strong": "var(--jz-strong)",
        "jz-adjust": "var(--jz-adjust)",
        "jz-weak": "var(--jz-weak)",
      },
      borderColor: {
        DEFAULT: "var(--jz-border)",
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["GeistMono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        outline: "var(--shadow-outline)",
        product: "var(--shadow-product)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        spring: "var(--ease-spring)",
      },
      transitionDuration: {
        fast: "140ms",
        base: "180ms",
        slow: "250ms",
      },
    },
  },
  plugins: [],
};
