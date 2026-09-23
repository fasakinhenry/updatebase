import { defineConfig } from 'vite'
import type {} from 'vite-react-ssg'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        id: '/',
        name: 'updatebase',
        short_name: 'updatebase',
        description:
          'turn any opportunity into a branded, numbered update your community actually reads.',
        theme_color: '#287bff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        categories: ['social', 'productivity', 'education'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'dicebear-avatars',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'remote-media',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // keep the animation stack out of the landing critical path so the
        // first paint only downloads react plus the route itself
        manualChunks(id: string) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'motion'
          }
          if (id.includes('node_modules/@tanstack')) return 'query'
          return undefined
        },
      },
    },
  },

  ssr: {
    noExternal: ['@phosphor-icons/react'],
  },

  ssgOptions: {
    script: 'async',
    formatting: 'none',
    dirStyle: 'nested',
    // inline the css each prerendered page actually uses so the first paint
    // needs no blocking stylesheet round trip
    beastiesOptions: {
      preload: 'swap',
      pruneSource: false,
    },
  },
})
