interface ImportMetaEnv {
    readonly VITE_APP_ENV: string;
    readonly VITE_APP_URL: string;
    readonly APP_ENV: string;
    readonly APP_URL_LOCAL: string;
    readonly APP_URL: string;
    readonly APP_NAME: string;
    readonly APP_KEY: string;
    readonly GOOGLE_RECAPTCHA_SITE_KEY: string;
    readonly GOOGLE_RECAPTCHA_SECRET: string;
    readonly CLIENT_ADMIN: string;
    readonly SECRET_ADMIN: string;
    readonly CLIENT_USER: string;
    readonly SECRET_USER: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
