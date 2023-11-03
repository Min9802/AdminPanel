import axios from "../index";

class AdminAuthApi {
    static Login = (data: any) => {
        return axios.post(`${base}/login`, data);
    };
    static Logout = () => {
        return axios.post(`${base}/logout`, null);
    };
    static Info = (access_token: string | null) => {
        return axios.post(`${base}/info`, null, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
    };
    static Refresh = (access_token: string) => {
        return axios.post(`${base}/refresh`, null, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
    };
    static UpdateInfo = (data: any) => {
        return axios.post(`${base}/update`, data);
    };
}

let base = "admin/auth";

export default AdminAuthApi;
