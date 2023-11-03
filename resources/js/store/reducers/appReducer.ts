import { Reducer } from "redux";
import actionTypes from "../actions/actionTypes"; // Make sure to import your actionTypes and AppAction types

interface ContentOfConfirmModal {
    isOpen: boolean;
    messageId: string;
    handleFunc: (() => void) | null;
    dataFunc: (() => void) | null;
}
export type pageInfoProps = {
    title?: string;
    desc?: string;
    ogtitle?: string;
    siteName?: string;
    description?: string;
    url?: string;
    image?: string;
};
export type AppState = {
    loading: boolean;
    started: boolean;
    theme: string;
    config: any[] | boolean; // Replace 'any' with the appropriate type for your config
    notice: any[] | boolean;
    language: string;
    pageInfo: pageInfoProps[] | boolean; // Replace 'any' with the appropriate type for your pageInfo
    // contentOfConfirmModal: ContentOfConfirmModal;
}

const initContentOfConfirmModal: ContentOfConfirmModal = {
    isOpen: false,
    messageId: "",
    handleFunc: null,
    dataFunc: null,
};
const Locale = navigator.language;

const initialState: AppState = {
    loading: false,
    started: true,
    theme: "light",
    config: false,
    notice: false,
    language: Locale,
    pageInfo: false,
    // contentOfConfirmModal: { ...initContentOfConfirmModal },
};

const appReducer: Reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case actionTypes.APP_START_UP_COMPLETE:
            return {
                ...state,
                started: true,
            };
        case actionTypes.CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.language,
            };
        case actionTypes.SET_THEME:
            return {
                ...state,
                theme: action.theme,
            };
        case actionTypes.SET_INFO_PAGE:
            return {
                ...state,
                pageInfo: action.pageInfo,
            };
        case actionTypes.SET_CONFIG:
            return {
                ...state,
                config: action.config,
            };
        case actionTypes.SET_NOTICE:
            return {
                ...state,
                notice: action.notice,
            };
        case actionTypes.CLEAR_NOTICE:
            return {
                ...state,
                notice: false,
            };
        default:
            return state;
    }
};

export default appReducer;
