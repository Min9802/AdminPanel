import axios from "../index";
class AdminProductApi {
    static list = () => {
        return axios.get(`${base}`);
    };
    static get = () => {
        return axios.get(`${base}/get`);
    };
    static add = (data: any) => {
        return axios.post(`${base}/store`, data);
    };
    static update = (id: string, data: any) => {
        return axios.post(`${base}/update/${id}`, data);
    };
    static updateStatus = (id: string) => {
        return axios.patch(`${base}/status/${id}`);
    };
    static delete = (id: string,) => {
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
let base = "admin/product";
export default AdminProductApi;
