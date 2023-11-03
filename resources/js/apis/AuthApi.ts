import axios from "./index";
type Data = {
    access_token?: string;
}
class AuthApi {
    static Login = (data: Data) => {
        return axios.post(`${base}/login`, data);
    };

    static Register = (data: Data) => {
        return axios.post(`${base}/register`, data);
    };

    static Logout = () => {
        return axios.post(`${base}/logout`);
    };
    static Info = (access_token: string | null) => {
        return axios.post(`${base}/info`, null, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
    };
    static Refresh = () => {
        return axios.post(`${base}/refresh`);
    };
    static UpdateInfo = (data: Data) => {
        return axios.post(`${base}/update`, data);
    };
}

let base = "auth";

export default AuthApi;
