import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201c",
        moss: "#3d6650",
        sage: "#dfe8dc",
        cream: "#fff8eb",
        clay: "#b96b4f",
        gold: "#dcae51",
        tide: "#345c73"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Aptos", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 28, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
