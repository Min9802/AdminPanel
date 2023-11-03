import axios from "../index";

class AdminUserApi {
    static getUser = () => {
        return axios.get(`${base}/index`);
    };

}
let base = "admin/user";

export default AdminUserApi;
