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
        "blue": "#342F83",
        "white": "#FEFEFE",
      },
      maxWidth: {
        '600': '37.5rem',
      },
      height: {
        '560': '35rem'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  safelist: [
    'shadow-green-500',
    'shadow-green-300',
    'shadow-lime-300',
    'shadow-cyan-200',
    'shadow-cyan-400',
    'shadow-red-300',
    'shadow-red-600',
    'border-green-500',
    'border-green-300',
    'border-lime-300',
    'border-cyan-200',
    'border-cyan-400',
    'border-red-300',
    'border-red-600',
  ],
  plugins: [],
};
export default config;
