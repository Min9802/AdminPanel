import axios from "../index";

class FileManagerAPI {
    /**
     * api disk
     */
    static initialize = (data: any = null) => {
        return axios.get(`${base}/initialize`, {
            params: data,
        });
    };
    static content = (disk: string, path: string = "") => {
        return axios.get(`${base}/content`, {
            params: {
                disk,
                path
            },
        });
    };
    static tree = (disk: string, path: string = "") => {
        return axios.get(`${base}/tree`, {
            params: {
                disk,
                path
            },
        });
    };
    static selectDisk = (data: any) => {
        return axios.get(`${base}/select-disk`, {
            params: data,
        });
    };
    static upload = (data: any) => {
        return axios.post(`${base}/upload`, data);
    };
    static delete = (data: any) => {
        return axios.post(`${base}/delete`, data);
    };
    static paste = (data: any) => {
        return axios.post(`${base}/paste`, data);
    };
    static rename = (data: any) => {
        return axios.post(`${base}/rename`, data);
    };
    static download = (data: any) => {
        return axios.get(`${base}/download`, {
            responseType: "arraybuffer",
            params: data,
        });
    };
    static thumbnails = (data: any) => {
        return axios.get(`${base}/thumbnails`, {
            responseType: "arraybuffer",
            params: data,
        });
    };
    static preview = (data: any) => {
        return axios.get(`${base}/preview`, {
            responseType: "arraybuffer",
            params: data,
        });
    };
    static url = (data: any) => {
        return axios.get(`${base}/url`, {
            params: data,
        });
    };
    static info = (disk: string, path: string) => {
        return axios.get(`${base}/info`, {
            params: {
                disk,
                path
            },
        });
    };
    static listshare = (data: any) => {
        return axios.post(`${base}/listshare`, data);
    };
    static share = (data: any) => {
        return axios.post(`${base}/share`, data);
    };
    static unshare = (data: any) => {
        return axios.post(`${base}/unshare`, data);
    };
    static checkExist = (data: any) => {
        return axios.post(`${base}/check-exist`, data);
    };
    static createDirectory = (data: any) => {
        return axios.post(`${base}/create-directory`, data);
    };
    static createFile = (data: any) => {
        return axios.post(`${base}/create-file`, data);
    };
    static updateFile = (data: any) => {
        return axios.post(`${base}/update-file`, data);
    };
    static streamFile = (data: any) => {
        return axios.get(`${base}/stream-file`, {
            responseType: "arraybuffer",
            params: data,
        });
    };
    static zip = (data: any) => {
        return axios.post(`${base}/zip`, data);
    };
    static unzip = (data: any) => {
        return axios.post(`${base}/unzip`, data);
    };
    static ckeditor = (data: any) => {
        return axios.get(`${base}/ckeditor`, {
            params: data,
        });
    };
    static tinymce = (data: any) => {
        return axios.get(`${base}/tinymce`, {
            params: data,
        });
    };
    static tinymce5 = (data: any) => {
        return axios.get(`${base}/tinymce5`, {
            params: data,
        });
    };
    static summernote = (data: any) => {
        return axios.get(`${base}/summernote`, {
            params: data,
        });
    };
    static fmButton = (data: any) => {
        return axios.get(`${base}/fm-button`, {
            params: data,
        });
    };
}
let base = "fm";

export default FileManagerAPI;
