import axios from "../index";

class AdminPermissionApi {
    static get = () => {
        return axios.get(`${base}`);
    };
    static add = (data: any) => {
        return axios.post(`${base}/store`, data);
    };
    static update = (id: string, data: any) => {
        return axios.patch(`${base}/update/${id}`, data);
    };
    static delete = (id: string) => {
        return axios.delete(`${base}/destroy/${id}`);
    };
}

let base = "admin/permission";

export default AdminPermissionApi;
