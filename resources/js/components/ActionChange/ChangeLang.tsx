import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "@/store/reducers/rootReducer";
import useChangeLang from "@/hooks/useChangeLang";

// Import Redux action
import * as actions from "@/store/actions";
// const EN = lazy(() => import("@root/assets/images/icon/icon-lang-en.svg"));
// const VI = lazy(() => import("@root/assets/images/icon/icon-lang-vi.svg"));
import EN from "@root/assets/images/icon/icon-lang-en.svg";
import VI from "@root/assets/images/icon/icon-lang-vi.svg";
import { useTranslation } from "react-i18next";

const ChangeLang: React.FC<PropsFromRedux & DispatchProps> = () => {
    const { t } = useTranslation();
    const [language, setLanguage] = useChangeLang();
    // const language = props.language;
    // const handleChangeLanguage = (lang: string) => {
    //     const bodyClass = window.document.body.classList;
    //     const className = 'lang';
    //     language === 'vi'
    //         ? bodyClass.add(className)
    //         : bodyClass.remove(className);
    //     props.changeLanguage(lang);
    // };
    return (
        <li>
            <label
                className={`relative m-0 block h-7 w-13 rounded-full ${
                    language === "vi" ? "bg-primary-light" : "bg-stroke"
                }`}
            >
                <input
                    type="checkbox"
                    onChange={() => {
                        if (typeof setLanguage === "function") {
                            setLanguage(language === "vi" ? "en" : "vi");
                            // handleChangeLanguage(
                            //     language === 'vi' ? 'en' : 'vi',
                            // );
                        }
                    }}
                    className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
                />
                <span
                    className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
                        language === "vi" && "!right-[3px] !translate-x-full"
                    }`}
                >
                    <span className="lang:hidden">
                        <img src={EN} alt={t("label.language")} />
                    </span>
                    <span className="hidden lang:inline-block">
                        <img src={VI} alt={t("label.language")} />
                    </span>
                </span>
            </label>
        </li>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        changeLanguage: (language: string) =>
            dispatch(actions.changeLanguageApp(language)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

// Define the additional props from mapDispatchToProps
interface DispatchProps {
    changeLanguage: (language: string) => void;
}

export default connector(ChangeLang);
