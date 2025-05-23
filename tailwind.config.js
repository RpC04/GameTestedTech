/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
    "*.{js,ts,jsx,tsx,mdx}", // Solo pon esto si realmente tienes archivos sueltos en la raíz, si no puedes quitarlo.
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
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
        // Custom colors del segundo config
        "game-dark": "#10061e",
        "game-purple": "#1f0032",
        "game-black": "#1a1a1a",
        "game-white": "#ffffff",
        "game-blue": "#0673b8",
        "game-cyan": "#8fc9ff",
        "game-dark-blue": "#026aa2",
        "game-pink": "#c11574",
        "game-gray": "#c0c5d0",
        "game-tag-blue": "#066fb3",
      },
      borderColor: {
        border: "#e5e7eb", // Activa border-border
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Agrega el bloque typography del primero
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "#fff",
            a: {
              color: "#3b82f6",
              "&:hover": {
                color: "#2563eb",
              },
            },
            h1: { color: "#fff" },
            h2: { color: "#fff" },
            h3: { color: "#fff" },
            h4: { color: "#fff" },
            h5: { color: "#fff" },
            h6: { color: "#fff" },
            strong: { color: "#fff" },
            code: { color: "#fff" },
            figcaption: { color: "#94a3b8" },
            blockquote: {
              color: "#94a3b8",
              borderLeftColor: "#334155",
            },
          },
        },
      },
    },
  },
  safelist: [
    { pattern: /border-border/ },
    { pattern: /bg-game-dark/ },
    { pattern: /text-game-white/ },
    { pattern: /bg-game-tag-blue/ },
    { pattern: /text-white/ },
  ],
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}
