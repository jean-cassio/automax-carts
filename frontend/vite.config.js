import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macrosPlugin from 'vite-plugin-babel-macros'
import svgr from 'vite-plugin-svgr'
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
   server: {
    port: process.env.VITE_APP_PORT,
  },
  preview: {
    port: process.env.VITE_APP_PORT,
  },
  plugins: [
    react(),
    macrosPlugin(),
    svgr(),
  ],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  }
})
