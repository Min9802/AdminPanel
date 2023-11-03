import axios from "../index";
class AdminProductApi {
    static getProduct = () => {
        return axios.get(`${base}/index`);
    };
    static addProduct = (data: any) => {
        return axios.post(`${base}/store`, data);
    };
    static updateProduct = (id: string, data: any) => {
        return axios.post(`${base}/update/${id}`, data);
    };
    static updateStatus = (id: string) => {
        return axios.patch(`${base}/status/${id}`);
    };
    static deleteProduct = (id: string,) => {
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
let base = "admin/product";
export default AdminProductApi;
