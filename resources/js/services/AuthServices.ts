import AdminAuthApi from "@/apis/Admin/AdminAuthApi";
import { useAppDispatch } from "@/store/reducers/redux";
import { toast } from "@min98/ui";
import * as actions from "@/store/actions";

const checkAuth = async (token: any) => {
    const timeNow: any = new Date();
    const access_token = token.access_token;
    const expires = token.expires;
    const expiresAt = new Date(expires);
    const timeRefresh = new Date(timeNow.getTime() + 60000);
    if (expiresAt > timeNow) {
        try {
            const Authorization = await Info(access_token);
            return Authorization;
        } catch (err: any) {
            const error = err.response.data;
            const status: string = error.status;
            const message: string = error.message;
            const notify = {
                title: status,
                description: message,
                status: "error",
            };
            toast(notify);
            return false;
        }
    } else if (expiresAt >= timeRefresh) {
        const refresh = await refreshToken(access_token);
        if (refresh) {
            return refresh;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
const refreshToken = async (access_token: string) => {
    const dispatch = useAppDispatch();

    try {
        const response = await AdminAuthApi.Refresh(access_token);
        const user = { ...response.data };
        user.access_token = response.data.access_token;
        const expires = new Date();
        expires.setTime(
            expires.getTime() + user.expires_in * 1000
        );
        const admin = {
            access_token: user.access_token,
            expires: expires,
        };
        dispatch(actions.setAccessToken(admin));
        return admin;
        // props.adminLoginSuccess(admin);
    } catch (err: any) {
        const error = err.response.data;
        const status: string = error.status;
        const message: string = error.message;
        const notify = {
            title: status,
            description: message,
            status: "error",
        };
        toast(notify);
        return false;
    }
}
const Info = async (access_token = null) => {
    try {
        const response = await AdminAuthApi.Info(access_token);
        return response.data.content;
    } catch (err: any) {
        const error = err.response.data;
        const status: string = error.status;
        const message: string = error.message;
        const notify = {
            title: status,
            description: message,
            status: "error",
        };
        toast(notify);
        return false;
    }
}
const signOut = async () => {
    try {
        const response = await AdminAuthApi.Logout();
        const status: string = response.data.status;
        const message: string = response.data.message;
        const notify = {
            title: status,
            description: message,
            status: "success",
        };
        toast(notify);
        return true;
    } catch (err: any) {
        const error = err.response.data;
        const status: string = error.status;
        const message: string = error.message;
        const notify = {
            title: status,
            description: message,
            status: "error",
        };
        toast(notify);
        return false;
    }
}
export { checkAuth, refreshToken, Info, signOut };
