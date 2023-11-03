import React, { useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "@/lang/en.json"; // Import your language JSON files
import viTranslation from "@/lang/vi.json"; // Import your language JSON files
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";

// Set up i18n
i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            vi: { translation: viTranslation },
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

interface LangProviderProps {
    children: React.ReactNode;
}

const LangProvider: React.FC<LangProviderProps> = ({ children }) => {
    const languageSet = useSelector((state: RootState) => state.app.language);

    useEffect(() => {
        i18n.changeLanguage(languageSet);
    }, [languageSet]);

    return <>{children}</>;
};

export default LangProvider;
