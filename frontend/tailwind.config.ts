import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFEFB3',
          400: '#D4AF37',
          600: '#B8960C',
          900: '#7A6200',
        },
        sky: {
          50: '#F0F8FF',
          100: '#E0F0FF',
          400: '#4DA6FF',
          600: '#1A7FDB',
          900: '#0A3D6B',
        },
        cloud: {
          white: '#FAFCFF',
          gray: '#E8EDF5',
        },
        neon: {
          cyan: '#00F5D4',
          purple: '#9B5DE5',
          gold: '#FFD700',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0A3D6B 0%, #1A7FDB 50%, #D4AF37 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.95) 100%)',
      },
      boxShadow: {
        gold: '0 4px 24px rgba(212, 175, 55, 0.25)',
        neon: '0 0 20px rgba(0, 245, 212, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
