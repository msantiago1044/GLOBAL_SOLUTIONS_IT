import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#15181D', // Ultra dark background
          900: '#1E2229', // Master Charcoal
          850: '#242932', // Surface Elevated
          800: '#2A303C', // Technical Graphite / Border
          700: '#3D4556', // Muted slate border
          600: '#64748B', // Muted text
          500: '#94A3B8', // Regular body text
          400: '#CBD5E1', // Highlighted text
          100: '#F1F5F9', // Pure light
        },
        radar: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          400: '#F5B038',
          500: '#EAA023', // Geophysics Radar Amber
          600: '#C78414',
          700: '#9E640B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'industrial-sm': '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
        'industrial-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'industrial-glow': '0 0 15px rgba(234, 160, 35, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
