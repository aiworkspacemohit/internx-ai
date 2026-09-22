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
        brand: {
          bg: '#f0f2f9',
          card: '#ffffff',
          dark: '#0f172a',
          slate: '#1e293b',
          indigo: '#4f46e5',
          'indigo-dark': '#4338ca',
          lime: '#bef264',
          'lime-accent': '#d9f99d',
          purple: '#8b5cf6',
          muted: '#64748b',
          border: '#e2e8f0',
          red: '#ef4444',
          emerald: '#10b981',
          amber: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Outfit', 'Space Grotesk', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      boxShadow: {
        'brand-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.08)',
        'brand-elevated': '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)',
        'red-glow': '0 10px 25px -5px rgba(185, 28, 28, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0.0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

