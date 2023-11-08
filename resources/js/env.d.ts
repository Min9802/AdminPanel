interface ImportMetaEnv {
    readonly VITE_APP_ENV: string;
    readonly VITE_APP_URL_LOCAL: string;
    readonly VITE_APP_URL: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_KEY: string;
    readonly VITE_RECAPTCHA_SITE_KEY: string;
    readonly VITE_RECAPTCHA_SECRET: string;
    readonly VITE_CLIENT_ADMIN: string;
    readonly VITE_SECRET_ADMIN: string;
    readonly VITE_CLIENT_USER: string;
    readonly VITE_SECRET_USER: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
