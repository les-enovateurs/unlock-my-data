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
        '600': '37.5rem',
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
      }
    },
  },
  plugins: [],
};
export default config;
