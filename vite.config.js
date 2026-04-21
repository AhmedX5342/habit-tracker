import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173, // Keep frontend on 5173 for development
        proxy: {
            '/data': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
            '/diary': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
});
