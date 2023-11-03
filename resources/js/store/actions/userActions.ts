import actionTypes from './actionTypes'; // Make sure to import your actionTypes enum
import { Action } from 'redux';

export interface UserAction extends Action<actionTypes> {
    userInfo?: any[];
    access_token?: any[];
    refresh_token?: any[];
}

export const setAccessTokenUser = (token: any): UserAction => ({
    type: actionTypes.SET_ACCESS_TOKEN,
    access_token: token,
});

export const clearAccessTokenUser = (): UserAction => ({
    type: actionTypes.CLEAR_ACCESS_TOKEN,
});

export const setRefreshTokenUser = (token: any): UserAction => ({
    type: actionTypes.SET_REFRESH_TOKEN,
    refresh_token: token,
});

export const clearRefreshTokenUser = (): UserAction => ({
    type: actionTypes.CLEAR_REFRESH_TOKEN,
});

export const processLogoutUser = (): UserAction => ({
    type: actionTypes.USER_LOGOUT,
});

export const setUser = (userInfo: any): UserAction => ({
    type: actionTypes.SET_USER,
    userInfo: userInfo,
});

export const unsetUser = (): UserAction => ({
    type: actionTypes.UNSET_USER,
});
