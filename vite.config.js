import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5544, // tu puerto personalizado
    allowedHosts: [
      'localhost',
      'f682-38-25-51-45.ngrok-free.app', // opcional si usas ngrok
      'tienda-fullo.vercel.app'         // tu frontend desplegado
    ],
    proxy: {
      '/api': {
        target: 'https://backend-fullo.onrender.com',
        changeOrigin: true,
        secure: true, // HTTPS requiere secure true
        rewrite: (path) => path.replace(/^\/api/, ''), // si tu backend no usa /api
      },
    },
  },

  plugins: [
    svelte(),
    tailwindcss(),
  ],

  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
})
