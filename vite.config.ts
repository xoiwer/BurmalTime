import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — сайт работает из любой папки/поддомена (GitHub Pages, Netlify, Vercel…)
export default defineConfig({ base: './', plugins: [react()] });
