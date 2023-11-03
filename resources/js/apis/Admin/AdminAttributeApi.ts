import axios from "../index";
class AdminAttributeApi {
    static getAttribute = (data) => {
        return axios.get(`${base}/index`);
    };
    static getAttributeEnable = () => {
        return axios.get(`${base}/get`);
    };
    static addAttribute = (data: any) => {
        return axios.post(`${base}/store`, data);
    };
    static updateAttribute = (id: string, data: any) => {
        return axios.patch(`${base}/update/${id}`, data);
    };
    static updateStatus = (id: string) => {
        return axios.patch(`${base}/status/${id}`);
    };
    static deleteAttribute = (id: string) => {
        return axios.delete(`${base}/destroy/${id}`);
    };
    static getTrash = () => {
        return axios.get(`${base}/trash`);
    };
    static restoreTrash = (id: string) => {
        return axios.get(`${base}/restore/${id}`);
    };
    static forceDelete = (id: string) => {
        return axios.delete(`${base}/forcedelete/${id}`);
    };
}
let base = "admin/attribute";
export default AdminAttributeApi;
