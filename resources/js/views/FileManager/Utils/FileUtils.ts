import reduxStore from "@/store/reducers/redux";

type extensionType = {
    [key: string]: string;
};
const extensionTypes: extensionType = {
    gif: "bi:filetype-gif",
    png: "bi:filetype-png",
    jpeg: "bi:filetype-jpg",
    jpg: "bi:filetype-jpg",
    bmp: "bi:filetype-bmp",
    psd: "bi:filetype-psd",
    svg: "bi:filetype-svg",
    ico: "bi:image",
    ai: "iconoir:adobe-illustrator",
    tif: "bi:filetype-tiff",
    tiff: "bi:filetype-tiff",
    webp: "iconoir:webp-format",

    // text
    txt: "bi:filetype-txt",
    json: "bi:filetype-json",
    log: "tabler:file-dots",
    ini: "tabler:file-dots",
    xml: "bi:filetype-xml",
    md: "tabler:file-dots",
    env: "tabler:file-dots",

    // code
    js: "bi:filetype-js",
    php: "bi:filetype-php",
    css: "bi:filetype-css",
    scss: "bi:filetype-scss",
    cpp: "tabler:brand-cpp",
    class: "bi:file-earmark-code",
    h: "bi:file-earmark-code",
    java: "bi:filetype-java",
    sh: "tabler:brand-powershell",
    swift: "tabler:brand-swift",

    // audio
    aif: "bi:file-music",
    cda: "bi:file-music",
    mid: "bi:file-music",
    mp3: "bi:file-music",
    mpa: "bi:file-music",
    ogg: "bi:file-music",
    wav: "bi:file-music",
    wma: "bi:file-music",

    // video
    wmv: "bi:file-play",
    avi: "bi:file-play",
    mpeg: "bi:file-play",
    mpg: "bi:file-play",
    flv: "bi:file-play",
    mp4: "bi:file-play",
    mkv: "bi:file-play",
    mov: "bi:file-play",
    ts: "bi:file-play",
    "3gpp": "bi:file-play",

    // archive
    zip: "bi:file-earmark-zip",
    arj: "bi:file-earmark-zip",
    deb: "bi:file-earmark-zip",
    pkg: "bi:file-earmark-zip",
    rar: "bi:file-earmark-zip",
    rpm: "bi:file-earmark-zip",
    "7z": "bi:file-earmark-zip",
    "tar.gz": "bi:file-earmark-zip",

    // application
    pdf: "bi:file-earmark-pdf",

    rtf: "tabler:brand-office",
    doc: "tabler:brand-office",
    docx: "tabler:brand-office",
    odt: "tabler:brand-office",

    xlr: "bi:file-earmark-spreadsheet",
    xls: "bi:file-earmark-spreadsheet",
    xlsx: "bi:file-earmark-spreadsheet",

    ppt: "bi:filetype-ppt",
    pptx: "bi:filetype-pptx",
    pptm: "bi:filetype-ppt",
    xps: "bi:filetype-ppt",
    potx: "bi:filetype-ppt",
}
/**
 * convert bytes to human
 * @param bytes number
 * @returns
 */
const bytesToHuman = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes === 0) return "0 Bytes";
    const calculate: number = Math.floor(Math.log(bytes) / Math.log(1024));

    if (calculate === 0) return `${bytes} ${sizes[calculate]}`;

    return `${(bytes / 1024 ** calculate).toFixed(1)} ${sizes[calculate]}`;
};
/**
 * timestamp to date
 * @param timestamp number
 * @returns
 */
const timestampToDate = (timestamp: number) => {
    const state = reduxStore.getState();
    const language = state.app?.language;
    if (timestamp === undefined || timestamp === null) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(language == "vi" ? "vn" : "en");
};
/**
 * extension to icon
 * @param extension string
 * @returns
 */
const extensionToIcon = (extension: string) => {
    if (
        extension &&
        extensionTypes[extension.toLowerCase()] !== undefined
    ) {
        return extensionTypes[extension.toLowerCase()];
    }
    // blank file
    return "tabler:file-filled";
};
/**
 * check extension
 * @param extension string
 * @returns
 */
const checkExtension = (extension: string) => {
    // Image extensions for view and preview
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];

    // Image extensions for cropping
    // const cropExtensions = ["png", "jpg", "jpeg", "webp"];

    // audio extensions for play
    const audioExtensions = ["ogg", "mp3", "aac", "wav"];

    // video extensions for play
    const videoExtensions = ["webm", "mp4"];

    // File extensions for code editor
    const textExtensions = ["sh", "css", "less", "sass", "scss", "html", "js", "ts", "vue", "htaccess", "env", "txt", "log", "ini", "xml", "md", "java", "c", "cpp", "cs", "scl", "php", "sql", "pl", "py", "lua", "swift", "rb", "go", "yaml", "json",]
    if (imageExtensions.includes(extension.toLowerCase())) {
        return "image";
    }
    if (audioExtensions.includes(extension.toLowerCase())) {
        return "audio";
    }
    if (videoExtensions.includes(extension.toLowerCase())) {
        return "video";
    }
    if (textExtensions.includes(extension.toLowerCase())) {
        return "text";
    }
    return false;
};
/**
 * get type
 * @param extension string
 * @returns
 */
const getType = (extension: string) => {
    const textExtensions: { [key: string]: string } = {
        sh: "x-sh",
        // styles
        css: "css",
        less: "x-less",
        sass: "x-sass",
        scss: "x-scss",
        html: "html",
        // js
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "javascript",
        vue: "x-vue",
        // text
        htaccess: "plain",
        env: "plain",
        txt: "plain",
        log: "plain",
        ini: "x-ini",
        xml: "application/xml",
        md: "x-markdown",
        // c-like
        java: "x-java",
        c: "x-csrc",
        cpp: "x-c++src",
        cs: "x-csharp",
        scl: "x-scala",
        php: "application/x-httpd-php",
        // DB
        sql: "x-sql",
        // other
        pl: "x-perl",
        py: "x-python",
        lua: "x-lua",
        swift: "x-swift",
        rb: "x-ruby",
        go: "x-go",
        yaml: "x-yaml",
        json: "application/json",
    };
    return textExtensions[extension.toLowerCase()];
}
/**
 * split file name
 * @param fileName string
 * @returns
 */
const splitFileName = (fileName: string) => {
    let newName = fileName;
    if (fileName.length > 10) {
        newName = fileName.slice(0, 7) + '..' + fileName.slice(-4)
    }
    return newName;
}
export { splitFileName, bytesToHuman, timestampToDate, extensionToIcon, checkExtension, getType }
