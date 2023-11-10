import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/reducers/redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import * as actions from "@/store/actions";
const useColorMode = () => {
    const dispatch = useAppDispatch();
    const themeSet = useSelector((state: RootState) => state.app.theme);
    // const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');
    const [theme, setTheme] = useState(themeSet);
    useEffect(() => {
        const className = "dark";
        const bodyClass = window.document.body.classList;

        theme === "dark"
            ? bodyClass.add(className)
            : bodyClass.remove(className);
        dispatch(actions.changeTheme(theme));
    }, [theme]);

    return [theme, setTheme];
};

export default useColorMode;
