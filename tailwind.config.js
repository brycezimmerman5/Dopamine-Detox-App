/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          surfaceHover: 'var(--color-surface-hover)',
          accent: 'var(--color-accent)',
          urge: 'var(--color-urge)',
        },
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn: 'var(--radius-button)',
      },
    },
  },
  plugins: [],
};
