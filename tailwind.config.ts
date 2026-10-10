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
        brand: {
          deep: '#004b87',       // Azul Corporativo Profundo GSIT
          navy: '#073b64',       // Navy Oscuro
          primary: '#0077b6',    // Azul GSIT Primario
          light: '#0096c7',      // Azul Claro
          cyan: '#00b4d8',       // Cyan Eléctrico
          ice: '#e0f2fe',        // Fondo Cyan Hielo
          accent: '#0284c7',     // Acento Subtítulo & Botones
          hover: '#003865',      // Hover Botón Principal
        },
        network: {
          pipe: '#2563eb',       // Tubería Conduit EMT (Azul técnico)
          cable: '#dc2626',      // Cable FPLR Incendio (Rojo fuego)
          detector: '#0d9488',   // Detectores de Humo (Teal)
          strobe: '#e11d48',     // Sirenas Estroboscópicas (Rojo intenso)
          panel: '#7c2d12',      // Central FACP (Borgoña)
        },
        surface: {
          main: '#f8fafc',       // Fondo de Aplicación Limpio
          card: '#ffffff',       // Superficie de Tarjetas Blanco Puro
          subtle: '#f1f5f9',     // Fondos Secundarios / Badges
          hover: '#e2e8f0',      // Hover State
          border: '#e2e8f0',     // Bordes Suaves
          borderStrong: '#cbd5e1', // Bordes Técnicos
        },
        gsitText: {
          main: '#0f172a',       // Texto Principal Oscuro
          secondary: '#475569',  // Texto Secundario
          muted: '#64748b',      // Texto Atenuado
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'gsit-sm': '0 1px 3px rgba(0, 75, 135, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'gsit-md': '0 4px 6px -1px rgba(0, 75, 135, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'gsit-lg': '0 10px 15px -3px rgba(0, 75, 135, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
