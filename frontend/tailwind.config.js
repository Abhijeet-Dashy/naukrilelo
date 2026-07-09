// Tailwind Configuration
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "#18181b",
        card: "#27272a",
        border: "#3f3f46",
        primaryText: "#fafafa",
        secondaryText: "#a1a1aa",
        accent: "#ffffff",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ['Helvetica', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'vercel': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      }
    },
  },
  plugins: [],
}
