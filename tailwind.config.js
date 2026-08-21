/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        hairline: '0 1px 2px 0 rgba(30, 35, 32, 0.04)',
        panel: '0 4px 20px -2px rgba(30, 35, 32, 0.06)',
      }
    },
  },
  plugins: [],
}
