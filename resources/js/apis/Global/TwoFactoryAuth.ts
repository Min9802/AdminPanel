import axios from "../index";

class TwoFactoryAuth {
    static getQR = () => {
        return axios.get(`${base}/`);
    };
    static enable2Fa = (data: any) => {
        return axios.post(`${base}/enable`, data);
    };
    static disable2Fa = () => {
        return axios.post(`${base}/disable`);
    };
    static verify2Fa = (data: any, token: string) => {
        return axios.post(`${base}/verify`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };
    static getOTP = (token: string) => {
        return axios.get(`${base}/getotp`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };
    static verifyOTP = (data: any, token: string) => {
        return axios.post(`${base}/otpverify`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };
}
let base = "two_face";
export default TwoFactoryAuth;
