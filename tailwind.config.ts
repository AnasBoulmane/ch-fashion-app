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
      maxWidth: {
        'product-sm': '34.93%',
        'product-md': '49.83%',
        'product-lg': '41.69%',
      },
    },
  },
  plugins: [
    // animate
    require('tailwindcss-animate'),
  ],
} satisfies Config
