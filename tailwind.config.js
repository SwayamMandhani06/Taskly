/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
        },
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          glow: "var(--accent-glow)",
        },
        priority: {
          urgent: "var(--urgent)",
          "urgent-soft": "var(--urgent-soft)",
          high: "var(--high)",
          "high-soft": "var(--high-soft)",
          medium: "var(--medium)",
          "medium-soft": "var(--medium-soft)",
          low: "var(--low)",
          "low-soft": "var(--low-soft)",
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'sans-serif'],
        display: ['Geist', 'Inter', 'sans-serif'],
        mono: ['Geist Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        hairline: 'var(--shadow-card)',
        card: 'var(--shadow-card)',
        hover: 'var(--shadow-hover)',
        glow: '0 4px 14px 0 var(--accent-glow)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
