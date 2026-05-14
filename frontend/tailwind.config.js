/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "#070707",
          800: "#0c0c0e",
          700: "#121214",
          600: "#161618",
          500: "#1c1c1f",
        },
        violet_premium: "#743089",
        violet_dark: "#3F2752",
        violet_glow: "#9D4BB8",
        orange_impact: "#FFA500",
        orange_dark: "#F28C28",
        gold_light: "#FFCB60",
        offwhite: "#F8F8F8",
        // shadcn tokens (kept for shadcn components)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "orbit-slow": {
          "0%": { transform: "translate3d(-10%, -10%, 0) scale(1)" },
          "50%": { transform: "translate3d(10%, 8%, 0) scale(1.1)" },
          "100%": { transform: "translate3d(-10%, -10%, 0) scale(1)" },
        },
        "ticker": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "shimmer": { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "orbit-slow": "orbit-slow 18s ease-in-out infinite",
        "ticker": "ticker 40s linear infinite",
        "shimmer": "shimmer 6s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
