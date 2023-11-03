import axios from "../index";
class AdminSettingApi {
    static getConfig = () => {
        return axios.get(`${base}/config`);
    };
    static saveSetting = (data: any) => {
        return axios.post(`${base}/save`, data);
    };
}
let base = "admin/setting";
export default AdminSettingApi;
