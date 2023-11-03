import axios from "../index";
class SettingApi {
    static getConfig = () => {
        return axios.get(`${base}/system`);
    };
    static setLang = (data: string) => {
        return axios.get(`${base}/setLocale/` + data);
    };
}
let base = "setting";
export default SettingApi;
