import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        rose: {
          DEFAULT: '#f0a0c0',
          deep: '#d4607a',
        },
        lavender: '#c4a8e8',
        gold: '#e0c878',
        mint: '#98dcc8',
        bg: {
          dark: '#07071a',
          dark2: '#0d0d26',
          light: '#faf4f8',
        }
      },
      animation: {
        shimmer: 'shimmer 6s ease infinite',
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s infinite',
        spinSlow: 'spin 20s linear infinite',
        orbGlow: 'orbGlow 8s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        orbGlow: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(5%,5%)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
