import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
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
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "corporate",
      {
        hacker: {
          "primary": "#10b981",          // Emerald green
          "primary-content": "#0a0a0a",
          "secondary": "#06b6d4",        // Cyan
          "secondary-content": "#0a0a0a",
          "accent": "#8b5cf6",           // Purple
          "accent-content": "#ffffff",
          "neutral": "#1f2937",          // Gray-800
          "neutral-content": "#e5e7eb",
          "base-100": "#0a0a0a",         // Almost black
          "base-200": "#111111",         // Slightly lighter
          "base-300": "#1a1a1a",         // Card backgrounds
          "base-content": "#e5e7eb",     // Light gray text
          "info": "#3b82f6",
          "info-content": "#ffffff",
          "success": "#10b981",
          "success-content": "#0a0a0a",
          "warning": "#f59e0b",
          "warning-content": "#0a0a0a",
          "error": "#ef4444",
          "error-content": "#ffffff",
          // Custom CSS variables for the hacker theme
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "0.25rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
} as any;

export default config;
