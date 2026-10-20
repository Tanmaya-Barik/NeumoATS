/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#212529',
          card: '#262a2e',
          darker: '#171a1d',
          lighter: '#2b3035',
        },
        primaryText: '#e2e8f0',
        mutedText: '#94a3b8',
        accent: {
          cyan: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
        }
      },
      boxShadow: {
        'neumo-raised': '8px 8px 16px #171a1d, -8px -8px 16px #2b3035',
        'neumo-raised-sm': '4px 4px 8px #171a1d, -4px -4px 8px #2b3035',
        'neumo-raised-lg': '12px 12px 24px #171a1d, -12px -12px 24px #2b3035',
        'neumo-inset': 'inset 6px 6px 12px #171a1d, inset -6px -6px 12px #2b3035',
        'neumo-inset-sm': 'inset 3px 3px 6px #171a1d, inset -3px -3px 6px #2b3035',
        'glow-cyan': '0 0 20px rgba(56, 189, 248, 0.35)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-crimson': '0 0 20px rgba(239, 68, 68, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
