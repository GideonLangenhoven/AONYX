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
        cssCodeSplit: true,
        minify: 'esbuild',
        target: 'es2018',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'kirshia website/main.html'),
                adventures: resolve(__dirname, 'kirshia website/adventures.html'),
                about: resolve(__dirname, 'kirshia website/about.html'),
                gallery: resolve(__dirname, 'kirshia website/gallery.html'),
                weather: resolve(__dirname, 'kirshia website/weather.html'),
                contact: resolve(__dirname, 'kirshia website/contact.html'),
                howItWorks: resolve(__dirname, 'kirshia website/how-it-works.html'),
                team: resolve(__dirname, 'kirshia website/team.html'),
                day: resolve(__dirname, 'kirshia website/day.html'),
                night: resolve(__dirname, 'kirshia website/night.html'),
                snorkel: resolve(__dirname, 'kirshia website/snorkel.html')
            }
        }
    }
});
