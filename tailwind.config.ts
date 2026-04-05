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
        "quiz-bg": "#07001c",
        "quiz-card": "#1a1535",
        "quiz-card-hover": "#221d42",
        "quiz-border": "#2d2850",
        "quiz-selected": "#2d2850",
        "quiz-purple": "#8A5EFF",
        "quiz-blue": "#4675FF",
        "quiz-teal": "#34CBBF",
        "quiz-progress": "#c4afff",
        "quiz-progress-track": "#2d2c2c",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-cta":
          "linear-gradient(90deg, #8A5EFF 0%, #4675FF 50%, #34CBBF 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scale-in": "scale-in 0.4s ease-out",
        "count-up": "count-up 0.3s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(138, 94, 255, 0.4), 0 0 40px rgba(70, 117, 255, 0.2)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(138, 94, 255, 0.7), 0 0 60px rgba(70, 117, 255, 0.4)",
          },
        },
        "scale-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "count-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
