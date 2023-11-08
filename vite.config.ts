import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
const tailwindcss = require('tailwindcss');
require('dotenv').config();
export default defineConfig({
    server: {
        watch: {
            // Increase the polling interval to a higher value (e.g., 1000ms) for faster reloads.
            // This is useful when working in environments where inotify doesn't work well (e.g., Docker on Windows).
            interval: 1000,
        },
    },
    define: {
        'process.env': {
            APP_ENV: process.env.APP_ENV,
            APP_URL_LOCAL: process.env.APP_URL_LOCAL,
            APP_URL: process.env.APP_URL,
            APP_NAME: process.env.APP_NAME || 'Min Services',
            APP_KEY: process.env.APP_KEY,

            RECAPTCHA_SITE_KEY: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
            RECAPTCHA_SECRET: process.env.GOOGLE_RECAPTCHA_SECRET,
            CLIENT_ADMIN: process.env.CLIENT_ADMIN,
            SECRET_ADMIN: process.env.SECRET_ADMIN,
            CLIENT_USER: process.env.CLIENT_USER,
            SECRET_USER: process.env.SECRET_USER,
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: 'resources/js/main.tsx', // Change this to the entry point of your app
            },
        },
        minify: true,
        outDir: 'public/build', // Change this to the desired output directory
        assetsDir: '', // Set to an empty string to prevent Vite from creating subdirectories
        cssCodeSplit: true, // Combine all CSS into a single file
        modulePreload: true,
    },
    plugins: [
        laravel({
            input: ['resources/js/main.tsx', 'resources/sass/app.scss'],
            refresh: true,
            // @ts-ignore
            postcss: {
                plugins: [
                    require('tailwindcss'),
                    require('autoprefixer'),
                ],
            },
        }),
        tailwindcss('./tailwind.config.ts'),
        viteSingleFile(),
        // react(),

    ],
    css: {
        preprocessorOptions: {
            scss: {},
        },
    }
});
