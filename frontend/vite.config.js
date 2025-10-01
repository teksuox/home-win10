import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      // 'autoUpdate' se encargará de actualizar el service worker en segundo plano
      // sin molestar al usuario.
      registerType: 'autoUpdate',
      // Activa la inyección del manifiesto en tu index.html
      injectRegister: 'auto',
      workbox: {
        // Define qué archivos deben ser cacheados por el service worker.
        // Esto cacheará todos los recursos estáticos comunes.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff,woff2}']
      },
      // Define el manifiesto de tu PWA. Esto es lo que permite que los usuarios
      // "instalen" tu aplicación en su pantalla de inicio.
      manifest: {
        name: 'Home Dashboard',
        short_name: 'Home',
        description: 'Tu página de inicio personal',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
