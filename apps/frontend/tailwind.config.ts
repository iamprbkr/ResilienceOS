import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#101418",
        cloud: "#f6f8fb",
        signal: "#2563eb",
        ember: "#ef6c3e",
        iris: "#6f5cff",
        limecore: "#93c5fd"
      }
    }
  },
  plugins: []
} satisfies Config;
