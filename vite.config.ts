import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), 
    tailwindcss(),
    VitePWA({
      // devOptions: {
      //   enabled: true
      // },
      // strategies: 'injectManifest',
      // srcDir: 'src',
      // filename: 'sw.ts',
      // registerType: 'autoUpdate',
      // injectManifest: {
      //   swDest: 'dist/sw.js'
      // },
      manifest: {
        name: 'Weather App',
        short_name: 'Lunite',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4f46e5',
        icons: [
              {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/pwa-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/pwa-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
        ]
      },
    }),
  ],
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }, 
    },
})
