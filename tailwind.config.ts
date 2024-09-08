import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "tablet": "500px"
      },
      colors: {
        "blue": "#342F83",
        "white": "#FEFEFE",
      },
      maxWidth: {
        '300': '300px',
        '600': '37.5rem',
      },
      minHeight: {
        '550': '550px',
      },
      height: {
        '560': '35rem',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      zIndex: {
        "full": "9999",
      },
      transitionDuration: {
        "2000": "2000ms",
      },
      borderWidth: {
        "1": "1px"
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) 1s"
      },
    },
  },
  plugins: [],
};
export default config;
