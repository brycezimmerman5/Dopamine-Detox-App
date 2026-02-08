import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Dopamine Detox',
        short_name: 'Dopamine Detox',
        description: 'Real-time urge intervention and breaking dopamine loops',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#14b8a6',
        icons: [
          { src: '/icon.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
