import { useEffect, useState } from "react";

import * as actions from "@/store/actions";
import { useAppDispatch } from "@/store/reducers/redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
const useChangeLang = () => {
    const dispatch = useAppDispatch();
    const languageSet = useSelector((state: RootState) => state.app.language);
    const [language, setLanguage] = useState<string>(languageSet);

    useEffect(() => {
        const bodyClass = window.document.body.classList;
        const className = "lang";
        language === "vi"
            ? bodyClass.add(className)
            : bodyClass.remove(className);
        dispatch(actions.changeLanguageApp(language));
    }, [language]);

    return [language, setLanguage];
};

export default useChangeLang;
