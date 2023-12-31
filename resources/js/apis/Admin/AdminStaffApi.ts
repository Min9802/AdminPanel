import axios from "../index";

class AdminStaffApi {
    static list = () => {
        return axios.get(`${base}`);
    };
    static add = (data: any) => {
        return axios.post(`${base}/store`, data);
    };
    static update = (id: string, data: any) => {
        return axios.patch(`${base}/update/${id}`, data);
    };
    static status = (id: string) => {
        return axios.patch(`${base}/status/${id}`);
    };
    static delete = (id: string) => {
        return axios.delete(`${base}/destroy/${id}`);
    };
    static trash = () => {
        return axios.get(`${base}/trash`);
    };
    static restore = (id: string) => {
        return axios.get(`${base}/restore/${id}`);
    };
    static forceDelete = (id: string) => {
        return axios.delete(`${base}/forcedelete/${id}`);
    };
}
let base = "admin/staff";

export default AdminStaffApi;
