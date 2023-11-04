import { FileManagerAPI } from "@/apis/Admin";
import { FileProps, Item, PreviewProps } from "../FileManager"
import { parseError } from "@/Utils/systemUtil";
import { toast } from "@min98/ui";
import { checkExtension } from "./FileUtils";
/**
 * upload file
 * @param disk string
 * @param path string
 * @param overwrite boolean
 * @param files File[]
 */
const upload = async (data: FormData) => {
    try {
        const response = await FileManagerAPI.upload(data);
        const message = response.data.result.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
    } catch (err) {
        parseError(err);
    }
}
/**
 * new file
 * @param disk string
 * @param name string
 * @param path string
 */
const newFile = async (disk: string, name: string, path: string | null) => {
    try {
        const dataSubmit = {
            disk: disk,
            name: name,
            path: path,
        };
        const response = await FileManagerAPI.createFile(dataSubmit);
        const message = response.data.result.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
    } catch (err) {
        parseError(err);
    }
}
/**
 * new Folder
 * @param disk string
 * @param name string
 * @param path string
 */
const newFolder = async (disk: string, name: string, path: string | null) => {
    try {
        const dataSubmit = {
            disk: disk,
            name: name,
            path: path,
        };
        const response = await FileManagerAPI.createDirectory(dataSubmit);
        const message = response.data.result.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
    } catch (err) {
        parseError(err);
    }
}
/**
 * download file
 * @param disk string
 * @param data FileProps
 */
const download = async (disk: string, data: FileProps) => {
    try {
        const dataSubmit = {
            disk: disk,
            path: data.path,
        };
        const response = await FileManagerAPI.download(dataSubmit);
        return response;
    } catch (err) {
        parseError(err);
        return false;
    }
}
/**
 * copy
 * @param disk string
 * @param data Item[]
 * @param type string
 * @returns
 */
const Clipboard = async (disk: string, data: Item[], type: string) => {
    const files = data.filter((value) => value.type === 'file').map((value) => value.path);
    const directories = data.filter((value) => value.type === 'dir').map((value) => value.path);
    const clipboard = {
        type: type,
        disk: disk,
        directories: directories,
        files: files,
    };
    return clipboard;

}
/**
 * paste
 * @param disk string
 * @param data any
 * @param path string
 * @returns
 */
const paste = async (disk: string, data: any, path: string) => {
    try {
        const dataSubmit = {
            disk: disk,
            path: path,
            clipboard: data,
        };
        const response = await FileManagerAPI.paste(dataSubmit);
        const message = response.data.result.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
        return true;
    } catch (err) {
        parseError(err);
        return false;
    }
}
/**
 * delete
 * @param disk: string
 * @param items: any
 * @returns
 */
const deleting = async (disk: string, items: any) => {

    try {
        const dataSubmit = {
            disk: disk,
            items: items
        };
        const response = await FileManagerAPI.delete(dataSubmit);
        const message = response.data.result.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
        return true;
    } catch (err) {
        parseError(err);
        return false;
    }
}
/**
 * rename
 * @param disk string
 * @param data data
 * @returns
 */
const rename = async (disk: string, data: any) => {
    try {
        const dataSubmit = {
            disk: disk,
            ...data
        };
        const response = await FileManagerAPI.rename(dataSubmit);
        const message = response.data.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
        return true;
    } catch (err) {
        parseError(err);
        return false;
    }
}
/**
 * file to data uri
 * @param blob Blob
 * @returns
 */
const fileToDataUri = (blob: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsDataURL(blob);
    });
};
/**
 * thumbnail
 * @param disk string
 * @param item any
 * @returns
 */
const thumbnail = async (disk: string, item: any) => {
    try {
        const dataSubmit = {
            disk: disk,
            path: item?.path,
            v: item?.timestamp
        };
        const response = await FileManagerAPI.thumbnails(dataSubmit);
        const mimeType =
            response.headers["content-type"].toLowerCase();
        const blob = new Blob([response.data], { type: mimeType });
        const blobUrl = await fileToDataUri(blob);
        return blobUrl;
    } catch (err) {
        parseError(err);
        return "";
    }
}
/**
 * stream file
 * @param dataSubmit FormData
 * @returns
 */
const streamFile = async (dataSubmit: any) => {
    try {
        const response = await FileManagerAPI.streamFile(dataSubmit);
        const mimeType =
            response.headers["content-type"].toLowerCase();
        const blob = new Blob([response.data], { type: mimeType });
        const blobUrl = fileToDataUri(blob);
        return blobUrl;
    } catch (err) {
        console.log(err);
        return "";
    }
}
/**
 * preview data
 * @param disk string
 * @param data FileProps
 * @returns
 */
const previewData = async (disk: string, data: FileProps) => {
    let DataPreview: PreviewProps = {};
    const dataSubmit = {
        disk: disk,
        path: data.path,
    };
    try {
        const type = checkExtension(data.extension);
        switch (type) {
            case "image":
                const imageBase64 = await streamFile(dataSubmit);
                DataPreview = {
                    type: type,
                    data: {
                        title: data.basename,
                        type: `image/${data.extension}`,
                        src: imageBase64 as string,
                    },
                };
                break;
            case "video":
                const videoUrl = await streamFile(dataSubmit);
                DataPreview = {
                    type: type,
                    data: {
                        title: data.basename,
                        src: videoUrl as string,
                        type: `video/${data.extension}`,
                    },
                };
                break;
            case "audio":
                const audioUrl = await streamFile(dataSubmit);
                DataPreview = {
                    type: type,
                    data: {
                        title: data.basename,
                        src: audioUrl as string,
                        type: `audio/${data.extension}`,
                    },
                };
                break;
            default:
                break;
        }
        return DataPreview;
    } catch (err) {
        // parseError(err);
        console.log(err);

        return DataPreview;
    }
}
/**
 * edit file
 * @param formData FormData
 * @returns
 */
const edit = async (formData: any) => {
    try {
        const response = await FileManagerAPI.updateFile(formData);
        const message = response.data.result.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
        return true;
    } catch (err) {
        parseError(err);
        return false;
    }
}
/**
 * list share
 * @param disk string
 * @param data any
 * @returns
 */
const listShare = async (disk: string, data: any) => {
    try {
        const dataSubmit = {
            path: data.path,
        };
        const response = await FileManagerAPI.listshare(dataSubmit);
        const file = response.data.content;
        const shares = file.shares;
        return shares;
    } catch (err) {
        parseError(err);
    }
}
/**
 * create share
 * @param disk string
 * @param data any
 * @returns
 */
const createShare = async (disk: string, data: any) => {
    try {
        const dataSubmit = {
            disk: disk,
            path: data.path,
        };
        const response = await FileManagerAPI.share(dataSubmit);
        const url = response.data.content;
        const message = response.data.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
        return url;

    } catch (err) {
        parseError(err);
    }
}
/**
 * unshare
 * @param id string
 */
const unShare = async (id: number) => {
    try {
        const response = await FileManagerAPI.unshare({ id });
        const message = response.data.message;
        const notify = {
            title: message,
            description: message,
            status: "success",
        };
        toast(notify);
    } catch (err) {
        parseError(err);
    }
};
export {
    listShare,
    createShare,
    unShare,
    newFile,
    newFolder,
    upload,
    rename,
    download,
    Clipboard,
    paste,
    deleting,
    edit,
    previewData,
    thumbnail
}
