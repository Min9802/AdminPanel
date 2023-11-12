import { GuardMiddleware } from "react-router-guarded-routes";

import reduxStore from "@/store/reducers/redux";
import { checkAuth } from "@/services/AuthServices";



export const AdminAuth: GuardMiddleware = async (to, from, next) => {
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
    } catch (err) {
        console.log(err);
        throw err;
    }

};



