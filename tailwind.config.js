/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './app/frontend/**/*.{js,jsx,ts,tsx}',
    './app/views/**/*.html.erb',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        kodibot: {
          orange: '#E18914',
          green: '#1D8536',
          yellow: '#F9DB2B',
        },
        // ... shadcn adds more
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}