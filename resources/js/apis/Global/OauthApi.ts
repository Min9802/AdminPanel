import axios from "../index";
class OauthApi {
    static Authorize = (data: any) => {
        return axios.get(`${base}/authorize`, {
            params: {
                ...data,
            },
        });
    };
    static Approve = (data: any) => {
        return axios.post(`${base}/authorize`, data);
    };
    static Deny = (data: any) => {
        return axios.delete(`${base}/authorize`, data);
    };
    static Token = (data: any) => {
        return axios.post(`${base}/token`, data);
    };
    static GetToken = (data: any) => {
        return axios.get(`${base}/tokens`, data);
    };
    static DeleteToken = (data: any) => {
        return axios.post(`${base}/tokens/${data}`);
    };
    static Scopes = () => {
        return axios.get(`${base}/scopes`);
    };
    static getClient = () => {
        return axios.get(`${base}/clients`);
    };
    static createClient = (data: any) => {
        return axios.post(`${base}/clients`, data);
    };
    static deleteClient = (data: any) => {
        return axios.delete(`${base}/clients/${data}`);
    };
}
var base = "oauth";
export default OauthApi;
