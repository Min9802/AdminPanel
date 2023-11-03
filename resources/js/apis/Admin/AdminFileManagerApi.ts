import axios from "../index";

class AdminFileManagerApi {
    /**
     * api file
     */
    static getFile = () => {
        return axios.get(`${base}/file/index`);
    };
    static addFile = (data: any) => {
        return axios.post(`${base}/file/store`, data);
    };
    static updateFile = (id: string, data: any) => {
        return axios.post(`${base}/file/update/${id}`, data);
    };
    static updateStatus = (id: string) => {
        return axios.patch(`${base}/file/status/${id}`);
    };
    static deleteFile = (id: string) => {
        return axios.delete(`${base}/file/destroy/${id}`);
    };
    static getTrash = () => {
        return axios.get(`${base}/file/trash`);
    };
    static restoreTrash = (id: string) => {
        return axios.get(`${base}/file/restore/${id}`);
    };
    static forceDelete = (id: string) => {
        return axios.delete(`${base}/file/forcedelete/${id}`);
    };
}
let base = "admin/filemanager";

export default AdminFileManagerApi;
