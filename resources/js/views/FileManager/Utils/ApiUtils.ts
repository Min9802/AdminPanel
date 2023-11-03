import { parseError } from "@/Utils/systemUtil"
import { FileManagerAPI } from "@/apis/Admin"

const initialize = async () => {
    try {
        const response = await FileManagerAPI.initialize();
        const config = response.data.config;
        return config;
    } catch (err) {
        parseError(err)
        throw err;
    }
}

const getContent = async (disk: string, path: string) => {
    try {
        const response = await FileManagerAPI.content(disk, path);
        const directories = response.data.directories;
        const files = response.data.files;
        return {
            directories,
            files,
        };
    } catch (err) {
        parseError(err);
        // You may want to handle errors appropriately here
        throw err;
    }
}

const getTree = async (disk: string, path: string) => {
    try {
        const response = await FileManagerAPI.tree(disk, path);
        const directories = response.data.directories;
        return directories;
    } catch (err) {
        parseError(err);
        // You may want to handle errors appropriately here
        throw err;
    }
}
export { initialize, getContent, getTree }
