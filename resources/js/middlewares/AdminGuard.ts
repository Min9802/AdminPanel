import { GuardMiddleware } from "react-router-guarded-routes";

import reduxStore from "@/store/reducers/redux";
import { checkAuth } from "@/services/AuthServices";
import { parseError } from "../Utils/systemUtil";



export const AdminAuth: GuardMiddleware = async (_, __, next) => {
    try {
        const state = reduxStore.getState();
        const access_token = state.admin?.access_token;

        if (access_token) {
            const Authorization = await checkAuth(access_token);
            if (Authorization) {
                return next();
            } else {
                window.location.href = "/admin/auth/signin";
            }
        } else {
            window.location.href = "/admin/auth/signin";
        }
    } catch (err: any) {
        parseError(err);
        throw err;
    }

};



