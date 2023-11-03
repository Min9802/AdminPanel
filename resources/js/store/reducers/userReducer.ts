import { Reducer } from 'redux';
import actionTypes from '../actions/actionTypes'; // Make sure to import your actionTypes and UserAction types

export type UserState = {
    userInfo: boolean;
    access_token: boolean | string;
    refresh_token: boolean | string;
}

const initialState: UserState = {
    userInfo: false,
    access_token: false,
    refresh_token: false,
};

const userReducer: Reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ACCESS_TOKEN:
            return {
                ...state,
                isLoggedIn: true,
                access_token: action.access_token,
            };
        case actionTypes.CLEAR_ACCESS_TOKEN:
            return {
                ...state,
                access_token: false,
            };
        case actionTypes.SET_REFRESH_TOKEN:
            return {
                ...state,
                refresh_token: action.refresh_token,
            };
        case actionTypes.CLEAR_REFRESH_TOKEN:
            return {
                ...state,
                refresh_token: false,
            };
        case actionTypes.USER_LOGOUT:
            return {
                ...state,
                token: false,
            };
        case actionTypes.SET_USER:
            return {
                ...state,
                userInfo: action.userInfo,
            };
        case actionTypes.UNSET_USER:
            return {
                ...state,
                userInfo: false,
            };
        default:
            return state;
    }
};

export default userReducer;
