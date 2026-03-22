import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: {
          DEFAULT: 'hsl(var(--accent-coral))',
          light: 'hsl(var(--accent-coral-light))',
          dark: 'hsl(var(--accent-coral-dark))',
        },
        navy: {
          DEFAULT: 'hsl(var(--accent-navy))',
          light: 'hsl(var(--accent-navy-light))',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
        xl: 'calc(var(--radius) + 8px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        elevated: '0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [tailwindAnimate],
}

export default config
