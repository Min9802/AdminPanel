import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { viteSingleFile } from 'vite-plugin-singlefile';
// require('dotenv').config();
import path from 'path';
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
export default defineConfig(config => {
    const env = loadEnv(config.mode, process.cwd(), '');
    return {
        server: {
            watch: {
                // Increase the polling interval to a higher value (e.g., 1000ms) for faster reloads.
                // This is useful when working in environments where inotify doesn't work well (e.g., Docker on Windows).
                interval: 50,
            },
        },
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
            __APP_URL_LOCAL__: JSON.stringify(env.APP_URL_LOCAL),
            __APP_URL__: JSON.stringify(env.APP_URL),
            __APP_NAME: JSON.stringify(env.APP_NAME || 'Min Services'),
            __APP_KEY__: JSON.stringify(env.APP_KEY),
            __RECAPTCHA_SITE_KEY__: JSON.stringify(env.GOOGLE_RECAPTCHA_SITE_KEY),
            __RECAPTCHA_SECRET__: JSON.stringify(env.GOOGLE_RECAPTCHA_SECRET),
            __CLIENT_ADMIN__: JSON.stringify(env.CLIENT_ADMIN),
            __SECRET_ADMIN__: JSON.stringify(env.SECRET_ADMIN),
            __CLIENT_USER__: JSON.stringify(env.CLIENT_USER),
            __SECRET_USER__: JSON.stringify(env.SECRET_USER),
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
                input: ['resources/sass/app.scss', 'resources/js/main.tsx'],
                refresh: true,

            }),
            viteSingleFile(),
            // react(),
            {
                name: 'blade',
                handleHotUpdate({ file, server }) {
                    if (file.endsWith('.blade.php')) {
                        server.ws.send({
                            type: 'full-reload',
                            path: '*',
                        });
                    }
                },
            }
        ],
        css: {
            preprocessorOptions: {
                scss: {},
            },
        },
        postcss: {
            plugins: [
                tailwindcss('./tailwind.config.cjs'),
                autoprefixer(),
            ],
        },
        resolve: {
            alias: {
                '@root': path.resolve(__dirname, 'resources'),
                '@': path.resolve(__dirname, 'resources/js'),
            },
        },
    }
});
