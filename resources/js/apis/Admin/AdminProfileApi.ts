import axios from "../index";

class AdminProfileApi {
    static show = () => {
        return axios.get(`${base}/show`);
    };
}
let base = "admin/profile";
export default AdminProfileApi;
