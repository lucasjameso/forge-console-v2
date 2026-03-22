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
        /* shadcn/ui color bridge -- makes bg-card, bg-background, text-foreground etc. work */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
        xl: 'calc(var(--radius) + 8px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'forge-card': '0 1px 4px rgba(120,90,60,0.08), 0 2px 8px rgba(120,90,60,0.04)',
        'forge-card-hover': '0 4px 16px rgba(120,90,60,0.12), 0 2px 4px rgba(120,90,60,0.06)',
        'forge-elevated': '0 4px 16px rgba(120,90,60,0.10)',
      },
    },
  },
  plugins: [tailwindAnimate],
}

export default config
