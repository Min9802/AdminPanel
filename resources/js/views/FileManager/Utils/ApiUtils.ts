import { FileManagerAPI } from "@/apis/Admin"
/**
 * init
 * @returns
 */
const initialize = async () => {
    const response = await FileManagerAPI.initialize();
    const config = response.data.config;
    return config;
}
/**
 * get content
 * @param disk string
 * @param path string
 * @returns
 */
const getContent = async (disk: string, path: string) => {
    const response = await FileManagerAPI.content(disk, path);
    const directories = response.data.directories;
    const files = response.data.files;
    return {
        directories,
        files,
    };
}
/**
 * get tree
 * @param disk string
 * @param path string
 * @returns
 */
const getTree = async (disk: string, path: string) => {
    const response = await FileManagerAPI.tree(disk, path);
    const directories = response.data.directories;
    return directories;
}
export { initialize, getContent, getTree }
