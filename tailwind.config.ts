import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fffbf7',
        charcoal: '#1a1a2e',
        'rose-gold': '#b76e79',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'pulse-badge': 'pulse-badge 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
