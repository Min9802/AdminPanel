import actionTypes from "./actionTypes"; // Make sure to import your AppAction and actionTypes types
import { Action } from "redux";
export interface AppAction extends Action<actionTypes> {
    loading?: boolean; // Default value is undefined
    started?: boolean; // Default value is undefined
    theme?: string; // Default value is undefined
    config?: any[] | null; // Default value is null
    notice?: any[] | false; // Default value is false
    language?: string | "vi"; // Default value is "vi"
    statusbar?: boolean; // Default value is undefined
    pageInfo?: any[] | null; // Default value is null
}
export const appStartUpComplete = (): AppAction => ({
    type: actionTypes.APP_START_UP_COMPLETE,
});

export const changeLanguageApp = (languagechange: string): AppAction => ({
    type: actionTypes.CHANGE_LANGUAGE,
    language: languagechange,
});
export const changeTheme = (theme: string): AppAction => ({
    type: actionTypes.SET_THEME,
    theme: theme,
});
export const SetInfoPage = (pageInfo: any): AppAction => ({
    type: actionTypes.SET_INFO_PAGE,
    pageInfo: pageInfo,
});

export const setConfig = (config: any): AppAction => ({
    type: actionTypes.SET_CONFIG,
    config: config,
});

export const setNotice = (notice: any): AppAction => ({
    type: actionTypes.SET_NOTICE,
    notice: notice,
});

export const clearNotice = (): AppAction => ({
    type: actionTypes.CLEAR_NOTICE,
    notice: false,
});

export const setLoading = (loading: boolean): AppAction => ({
    type: actionTypes.SET_LOADING,
    loading: loading,
});
