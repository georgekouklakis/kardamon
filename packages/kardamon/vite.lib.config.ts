import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [
        svelte({
            compilerOptions: {
                css: 'injected',
            },
        }),
    ],
    build: {
        lib: {
            entry: 'src/element.ts',
            name: 'KardamonGame',
            formats: ['iife'],
            fileName: () => 'kardamon-game.js',
        },
        outDir: 'dist/lib',
        cssCodeSplit: false,
    },
});
