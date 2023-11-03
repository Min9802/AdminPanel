import Default from "@/assets/images/files/BlankFile.png";
import CSS from "@/assets/images/files/CssFile.png";
import PDF from "@/assets/images/files/PdfFile.png";
import PNG from "@/assets/images/files/PngFile.png";
const { APP_ENV, APP_URL, APP_URL_LOCAL } = process.env;
export const API_SERVER =
    APP_ENV == "production" ? `${APP_URL}/api/v1/` : `${APP_URL_LOCAL}/api/v1/`;
export const USER_ROLE = {
    ADMIN: "1",
    USER: "0",
};
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
export const PermissionDefaut = ["role", "permission", "staff"];
export const ImageConfig: { [key: string]: string } = {
    default: Default,
    pdf: PDF,
    png: PNG,
    css: CSS,
};
export const configStorage = [
    {
        label: "Local Storage",
        value: "local",
    },
    {
        label: "Google Drive",
        value: "google_drive",
    },
    {
        label: "AWS",
        value: "aws",
    },
];
