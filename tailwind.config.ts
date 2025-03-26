import type { Config } from "tailwindcss";
import daisyui from "daisyui"
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: ["nord"],
    darkTheme: "light",
  },
  theme: {
    extend: {
      screens: {
        "tablet": "500px"
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      colors: {
        "color1": "#469AE0",
        "color2": "#fff",
        "color3": "#000",
        "rosepale": "#f9e8e0",
        "color4": "#433231",
        "beige": "#ffe5bd",
        "rouge": "#d2402d",
        "blue": "#342F83",
        "white": "#FEFEFE",
        "brown": "#933B0F",
        "bgblue": "#0063C1",
        "btnblue": "oklch(0.594359 0.077246 254.028)",
        primary: {
          50: '#E6F7F2',
          100: '#CCEFE5',
          200: '#99DFD1',
          300: '#66D0BC',
          400: '#33C0A8',
          500: '#08AA78',
          600: '#08AA78',
          700: '#08AA78',
          800: '#08AA78',
          900: '#08AA78',
          "blue": "#342F83",
          "white": "#FEFEFE",
          "brown": "#933B0F"
        },
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
  plugins: [daisyui],
};
export default config;
