import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          DEFAULT: "#343f64",
          50: "#f0f2f5",
          100: "#e1e5eb",
          200: "#c3cbd7",
          300: "#a5b1c3",
          400: "#8797af",
          500: "#697d9b",
          600: "#343f64",
          700: "#29324f",
          800: "#1e263a",
          900: "#141925",
        },
        orange: {
          DEFAULT: "#fc832b",
          50: "#fff5f0",
          100: "#ffebe0",
          200: "#ffd7c1",
          300: "#ffc3a2",
          400: "#ffaf83",
          500: "#fc832b",
          600: "#fc832b",
          700: "#e6731f",
          800: "#ba5307",
          900: "#a44300",
        },
      },
    },
  },
  plugins: [],
};
export default config;

