import { Action } from 'redux';
import actionTypes from './actionTypes'; // Make sure to import your actionTypes and actionTypes types

export interface AdminAction extends Action<actionTypes> {
    adminInfo?: any[];
    access_token?: any[];
    refresh_token?: any[];
}

export const setAccessToken = (token: any): AdminAction => ({
    type: actionTypes.SET_ACCESS_TOKEN,
    access_token: token,
});
export const clearAccessToken = (): AdminAction => ({
    type: actionTypes.CLEAR_ACCESS_TOKEN,
});
export const setRefreshToken = (token: any): AdminAction => ({
    type: actionTypes.SET_REFRESH_TOKEN,
    refresh_token: token,
});
export const clearRefreshToken = (): AdminAction => ({
    type: actionTypes.CLEAR_REFRESH_TOKEN,
});
export const processLogout = (): AdminAction => ({
    type: actionTypes.PROCESS_LOGOUT,
});
export const setAdmin = (adminInfo: any): AdminAction => ({
    type: actionTypes.SET_ADMIN,
    adminInfo: adminInfo,
});
export const unsetAdmin = (): AdminAction => ({
    type: actionTypes.UNSET_ADMIN,
});
