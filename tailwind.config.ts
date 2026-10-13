import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      ink: { 50: "#f6f5f2", 100: "#e9e6df", 200: "#cfc9bc", 300: "#a9a191", 400: "#7d7667", 500: "#5b554a", 600: "#3d3a34", 700: "#26252a", 800: "#17171c", 900: "#0f0f13", 950: "#08080b" },
      accent: { 50: "#fbf7ee", 100: "#f5ebd3", 200: "#ecd8a8", 300: "#e0c07a", 400: "#d4a853", 500: "#c4913a", 600: "#a5732e", 700: "#845828", 800: "#6d4826", 900: "#5c3d24" },
    },
    fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"], display: ["var(--font-display)", "Georgia", "serif"] },
    keyframes: { marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } }, shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } } },
    animation: { marquee: "marquee 40s linear infinite", shimmer: "shimmer 6s linear infinite" },
  } }, plugins: [] };
export default config;
