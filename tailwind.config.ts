import type { Config } from "tailwindcss";
import daisyui from "daisyui";

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
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        "shield-pulse": {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        "trust-fade": {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
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
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["corporate"],
  },
};

export default config;
