import axios from "../index";

class AdminUserApi {
    static list = () => {
        return axios.get(`${base}`);
    };

}
let base = "admin/user";

export default AdminUserApi;
