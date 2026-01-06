import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'kirshia website',
    server: {
        open: '/main.html'
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'kirshia website/main.html'),
                day: resolve(__dirname, 'kirshia website/day.html'),
                night: resolve(__dirname, 'kirshia website/night.html'),
                snorkel: resolve(__dirname, 'kirshia website/snorkel.html')
            }
        }
    }
});
