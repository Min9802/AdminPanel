import { FileManagerAPI } from "@/apis/Admin";
import { Buffer } from 'buffer';
/**
 * type of config
 */
type Config = {
    disk?: string,
    path?: string,
}
/**
 * type for resolving
 */
type Resolving = {
    default: string
}
/**
 * interface for FileLoader
 */
interface FileLoader {
    file: Promise<File>;
    uploadTotal: number;
    uploaded: number;
}
/**
 * interface for server
 */
interface ServerInterface {
    onUploadProgress(data: any): void;
    uploader(config: Config, file: File): Promise<Resolving>
    abortUpload(): void;
    makeDirectory(config: Config): Promise<any>;
    previewFile(data: previewFile): Promise<any>;
}
/**
 * type for previewing
 */
type previewFile = {
    disk: string;
    path: string;
}
/**
 * class Server Uploader
 */
class Server implements ServerInterface {
    /**
     * make directory
     * @param config
     * @returns
     */
    makeDirectory(config: Config) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const response = await FileManagerAPI.createDirectory({
                    disk: config.disk,
                    name: config.path,
                });
                resolve(response)
            } catch (err: any) {
                reject(err.message);
            }
        })
    }
    /**
     * preview file
     * @param data
     * @returns
     */
    previewFile(data: previewFile) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const response = await FileManagerAPI.preview(
                    data
                );
                const mimeType = response.headers["content-type"].toLowerCase();
                const imgBase64 = Buffer.from(response.data, "binary").toString("base64");
                const imageURL = `data:${mimeType};base64,${imgBase64}`;
                resolve({
                    default: imageURL,
                });
            } catch (err: any) {
                reject(err.message);
            }
        })
    }
    onUploadProgress(data: any) {
        return data;
    }
    /**
     * upload
     * @param config
     * @param loader
     * @returns
     */
    uploader(config: Config, file: File): Promise<Resolving> {
        console.log(file.name);

        const body = new FormData();
        body.append("files[]", file);
        body.append("disk", config.disk ?? "public");
        body.append("path", config.path ?? "Storage");
        body.append("overwrite", "1");
        return new Promise(async (resolve, reject) => {
            if (!config) {
                config = {
                    disk: "public",
                    path: "Storage",
                };
                await this.makeDirectory(config);
            }
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
            try {
                const response = await FileManagerAPI.upload(body);
                const data = {
                    disk: response.data.files[0].disk,
                    path: response.data.files[0].path,
                };
                const preview = this.previewFile(data);
                resolve(preview);
            } catch (err: any) {
                reject(err.message);
            }
        });
    }
    /**
     * abort the request
     */
    abortUpload() {

    }
}
/**
 * class Upload Adapter
 */
class UploadAdapter {
    private config: Config;
    private server: ServerInterface;
    private loader: any;

    constructor(config: Config, server: Server, loader: FileLoader) {
        this.config = config;
        this.server = server;
        this.loader = loader;
    }
    // Starts the upload process.
    upload() {
        return this.loader.file
            .then((file: File) => this.server.uploader(this.config, file));
    };
    // Aborts the upload process.
    // abort(): void {
    //     this.server.abortUpload();
    // }
}

export { UploadAdapter, Server };
