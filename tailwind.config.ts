import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'hsl(var(--primary))',
        muted: 'hsl(var(--muted))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
      },
      fontFamily: {
        noto: 'var(--font-noto-sans)',
        abchanel: 'var(--font-abchanel-corpo)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
      },
      opacity: {
        '60': '0.6',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.15s ease-out',
        'accordion-up': 'accordion-up 0.15s ease-out',
      },
    },
  },
  plugins: [
    // animate
    require('tailwindcss-animate'),
  ],
} satisfies Config
