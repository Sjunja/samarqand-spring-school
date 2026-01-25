/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          50: '#F3E8FF',
          100: '#E9D5FF',
          500: '#7B3F9E',
          600: '#6B2D8F',
          900: '#4A1D63',
          DEFAULT: '#7B3F9E',
          foreground: '#FFFFFF',
        },
        secondary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#4CAF50',
          600: '#43A047',
          900: '#1B5E20',
          DEFAULT: '#4CAF50',
          foreground: '#FFFFFF',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          500: '#A3A3A3',
          700: '#404040',
          900: '#171717',
        },
        destructive: {
          DEFAULT: '#D32F2F',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#404040',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717',
        },
        card: {
          DEFAULT: '#F5F5F5',
          foreground: '#171717',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#D32F2F',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        hero: ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        title: ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        subtitle: ['32px', { lineHeight: '1.3' }],
        'body-lg': ['20px', { lineHeight: '1.6' }],
        body: ['16px', { lineHeight: '1.5' }],
        small: ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4' }],
      },
      spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
        '2xl': '64px',
        '3xl': '96px',
        '4xl': '128px',
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '24px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        modal: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        nav: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
