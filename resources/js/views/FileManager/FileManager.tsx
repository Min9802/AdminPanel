import React, { MouseEvent } from "react";
import Header from "./Header";
import { Card, CardContent, CardHeader, toast } from "@min98/ui";
import LeftContent from "./LeftContent";
import { Col, Grid } from "@/components/Grid";
import TableView from "./TableView";
import { getContent, initialize } from "./Utils/ApiUtils";
import {
    Clipboard,
    deleting,
    download,
    edit,
    newFile,
    newFolder,
    paste,
    previewData,
    rename,
    upload,
} from "./Utils/ActionUtils";
import { useTranslation } from "react-i18next";
import ModalRename from "./Modal/ModalRename";
import ModalEdit from "./Modal/ModalEdit";
import ModalDelete from "./Modal/ModalDelete";
import ModalNewFile from "./Modal/ModalNewFile";
import ModalNewFolder from "./Modal/ModalNewFolder";
import ModalUpload from "./Modal/ModalUpload";
import ModalPreview from "./Modal/ModalPreview";
import GridView from "./GridView";
import { repeat } from "@/Utils/systemUtil";
import ListDisk from "./ListDisk";
import ModalDetail from "./Modal/ModalDetail";
export interface ViewProps {
    disk: string;
    view: string;
    current?: Item;
    currents?: Item[];
    directories: FolderProps[];
    files: FileProps[];
    setSelectDisk: (disk: string) => void;
    handleMultipleClick: (data: Item[]) => void;
    handleOneClick: (data: Item) => void;
    handleDoubleClick: (data: Item) => void;
    handleDownload: (data: Item) => void;
    handleCopy: (data: any) => void;
    handleCut: (data: any) => void;
    handlePaste: () => void;
    toggleModalDetail: (data: Item) => void;
    togglePreview: (data: FileProps) => void;
    toggleRename: (data: Item) => void;
    toggleEdit: (data: Item) => void;
    toggleDelete: (data: Item) => void;
}
export type Item = {
    basename: string;
    dirname: string;
    path: string;
    timestamp: number;
    type: string;
    visibility: string;
    extension: string;
    filename: string;
    size: number;
};
export type FolderProps = {
    type: string;
    path: string;
    open: boolean;
    basename: string;
    dirname: string;
    timestamp: number;
    visibility: string;
    acl: number;
    props: {
        hasSubdirectories: boolean;
    };
};
export type FileProps = {
    type: string;
    path: string;
    basename: string;
    dirname: string;
    extension: string;
    filename: string;
    size: number;
    timestamp: number;
    visibility: string;
};
export type PreviewProps = {
    type?: string;
    data?: {
        title?: string;
        src?: string;
        type?: string;
    };
};
export interface FileManagerProps {
    callback?: (data: any) => void;
}
const FileManager: React.FC<FileManagerProps> = ({ callback }) => {
    const { t } = useTranslation();
    const [view, setView] = React.useState<string>("grid");
    const [config, setConfig] = React.useState<any>(false);
    const [disks, setDisks] = React.useState<string[]>([]);
    const [selectDisk, setSelectDisk] = React.useState<string>("public");
    const [directories, setDirectories] = React.useState<FolderProps[]>([]);
    const [files, setFiles] = React.useState<FileProps[]>([]);
    const [selectFolder, setSelectFolder] = React.useState<FolderProps>();
    const [currentItem, setCurrentItem] = React.useState<Item>();
    const [reload, setReload] = React.useState<boolean>(false);
    const [selectedList, setSelectedList] = React.useState<Item[]>([]);
    const [clipboard, setClipboard] = React.useState<any>(false);

    const [filesUpload, setFileUpload] = React.useState<File[]>([]);

    const [preview, setPreview] = React.useState<PreviewProps>({});

    const [modalDetail, setModalDetail] = React.useState<boolean>(false);
    const [modalUpload, setModalUpload] = React.useState<boolean>(false);
    const [modalPreview, setModalPreview] = React.useState<boolean>(false);
    const [modalRename, setModalRename] = React.useState<boolean>(false);
    const [modalEdit, setModalEdit] = React.useState<boolean>(false);
    const [modalDelete, setModalDelete] = React.useState<boolean>(false);
    const [modalNewFile, setModalNewFile] = React.useState<boolean>(false);
    const [modalNewFolder, setModalNewFolder] = React.useState<boolean>(false);
    /**
     * init config
     */
    React.useEffect(() => {
        if (!config) {
            InitConfig();
        }
    }, []);
    /**
     * set disks
     */
    React.useEffect(() => {
        if (config) {
            const disks_config = Object.keys(config.disks);
            setDisks(disks_config);
        }
    }, [config]);
    /**
     * set select disk
     */
    React.useEffect(() => {
        if (disks.length > 0 && !selectDisk) {
            setSelectDisk(disks[0]);
        }
    }, [disks]);
    /**
     * get content when select disk
     */
    React.useEffect(() => {
        GetContent(selectDisk, "/");
        setReload(false);
    }, [selectDisk]);
    /**
     * get content when select folder or reload
     */
    React.useEffect(() => {
        if (selectFolder || reload) {
            if (selectFolder) {
                GetContent(selectDisk, selectFolder?.path);
                setReload(false);
            } else {
                GetContent(selectDisk, "/");
                setReload(false);
            }
        }
    }, [selectFolder, reload]);
    /**
     * set timeout for reset selected
     */
    React.useEffect(() => {
        repeat(() => {
            setSelectFolder(undefined);
            setClipboard(false);
            setSelectedList([]);
            setCurrentItem(undefined);
        }, 60000);
    }, []);
    /**
     * callbacks for parent
     */
    React.useCallback(() => {
        callback?.(currentItem);
    }, [currentItem]);
    /**
     * toggle reload state
     */
    const toggleReload = () => {
        setReload(!reload);
    };
    /**
     * toggle modal new file
     */
    const toggleNewFile = () => {
        setModalNewFile(!modalNewFile);
    };
    /**
     * toggle modal new folder
     */
    const toggleNewFolder = () => {
        setModalNewFolder(!modalNewFolder);
    };
    /**
     * toggle modal upload
     */
    const toggleUpload = () => {
        setModalUpload(!modalUpload);
    };
    /**
     * toggle modal detail
     * @param data
     */
    const toggleModalDetail = (data: Item) => {
        setModalDetail(!modalDetail);
        setCurrentItem(data);
    };
    /**
     * toggle modal preview
     */
    const togglePreview = async (data: FileProps) => {
        setModalPreview(!modalPreview);
        const dataPreview = await previewData(selectDisk, data);
        setPreview(dataPreview);
    };
    /**
     * toggle modal edit
     * @param data
     */
    const toggleEdit = (data: Item) => {
        setCurrentItem(data);
        setModalEdit(!modalEdit);
    };
    /**
     * toggle modal rename
     * @param data
     */
    const toggleRename = (data: Item) => {
        setCurrentItem(data);
        setModalRename(!modalRename);
    };
    /**
     * toggle modal delete
     * @param data
     */
    const toggleDelete = (data: Item) => {
        setCurrentItem(data);
        setModalDelete(!modalDelete);
    };
    /**
     * handle one click
     * @param data
     */
    const handleOneClick = React.useCallback(
        (data: Item) => {
            setCurrentItem(data);
        },
        [setCurrentItem],
    );
    /**
     * handle multile click
     */
    const handleMultileClick = React.useCallback(
        (data: Item[]) => {
            setSelectedList(data);
        },
        [setSelectedList],
    );

    /**
     * handle double click
     * @param data
     */
    const handleDoubleClick = (data: any) => {
        setCurrentItem(data);
        setSelectFolder(data);
        setSelectedList([]);
    };
    /**
     * handle new file
     * @param data
     */
    const handleNewFile = async (data: { [key: string]: string }) => {
        await newFile(
            selectDisk,
            data.name,
            selectFolder ? selectFolder.path : null,
        );
        setReload(true);
        setCurrentItem(undefined);
    };
    /**
     * handle new folder
     * @param data
     */
    const handleNewFolder = async (data: any) => {
        await newFolder(
            selectDisk,
            data.name,
            selectFolder ? selectFolder.path : null,
        );
        setReload(true);
        setCurrentItem(undefined);
    };
    /**
     * handle rename
     * @param data
     */
    const handleRename = async (data: Item) => {
        await rename(selectDisk, data);
        setReload(true);
        setCurrentItem(undefined);
    };
    /**
     * handle edit file
     * @param data
     */
    const handleEdit = async (data: any) => {
        const formData = new FormData();
        formData.append("disk", selectDisk);
        formData.append("path", (currentItem as FileProps).dirname);
        formData.append(
            "file",
            new Blob([data]),
            (currentItem as FileProps).basename,
        );
        await edit(formData);
        setModalEdit(false);
        setCurrentItem(undefined);
    };
    /**
     * handle upload
     */
    const handleUpload = async () => {
        const formData = new FormData();
        for (let i = 0; i < filesUpload.length; i++) {
            formData.append("files[]", filesUpload[i]);
        }
        formData.append("disk", selectDisk);
        formData.append("path", selectFolder?.path ?? "/");
        await upload(formData);
        setReload(true);
        setModalUpload(false);
    };
    /**
     * handle download
     * @param data
     */
    const handleDownload = async (data: Item) => {
        const tempLink = document.createElement("a");
        tempLink.style.display = "none";
        tempLink.setAttribute("download", data.basename);
        const response = await download(selectDisk, data);

        if (response && response.status === 200) {
            const responseData = response.data;
            tempLink.href = responseData;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        }
    };
    /**
     * handle copy
     * @param data
     */
    const handleCopy = async (data: Item) => {
        if (data) {
            const dataCopy = await Clipboard(selectDisk, [data], "copy");
            setClipboard(dataCopy);
        } else if (selectedList.length > 0) {
            const dataCopy = await Clipboard(selectDisk, selectedList, "copy");
            setClipboard(dataCopy);
        } else {
            const notify = {
                title: t("label.need_select_item"),
                description: t("label.need_select_item"),
                status: "error",
            };
            toast(notify);
        }
        setSelectedList([]);
    };
    /**
     * handle cut
     * @param data
     */
    const handleCut = async (data: Item) => {
        if (data) {
            const dataCopy = await Clipboard(selectDisk, [data], "cut");
            setClipboard(dataCopy);
        } else if (selectedList.length > 0) {
            const dataCopy = await Clipboard(selectDisk, selectedList, "cut");
            setClipboard(dataCopy);
        } else {
            const notify = {
                title: t("label.need_select_item"),
                description: t("label.need_select_item"),
                status: "error",
            };
            toast(notify);
        }
        setSelectedList([]);
    };
    /**
     * handle paste
     */
    const handlePaste = async () => {
        if (selectFolder) {
            await paste(selectDisk, clipboard, selectFolder?.path);
        } else {
            await paste(selectDisk, clipboard, "/");
        }
        setSelectedList([]);
        setClipboard(false);
        setReload(true);
    };
    /**
     * handle delete
     */
    const handleDelete = async () => {
        if (selectedList.length > 0) {
            const items = selectedList.map((item) => {
                return { path: item.path, type: item.type };
            });
            await deleting(selectDisk, items);
        } else if (currentItem) {
            await deleting(selectDisk, [
                {
                    path: currentItem.path,
                    type: currentItem.type,
                },
            ]);
        } else {
            const notify = {
                title: t("label.need_select_item"),
                description: t("label.need_select_item"),
                status: "error",
            };
            toast(notify);
        }
        setSelectedList([]);
        setReload(true);
        setModalDelete(false);
        setCurrentItem(undefined);
    };
    /**
     * InitConfig
     */
    const InitConfig = async () => {
        const config = await initialize();
        setConfig(config);
    };
    /**
     * get content
     * @param disk
     * @param path
     */
    const GetContent = async (disk: string, path: string) => {
        const data = await getContent(disk, path);
        const { directories, files } = data;
        setDirectories(directories);
        setFiles(files);
    };
    return (
        <Card>
            <ModalDetail
                open={modalDetail}
                onClose={() => {
                    setModalDetail(false);
                    setCurrentItem(undefined);
                }}
                disk={selectDisk}
                item={currentItem}
            />
            <ModalPreview
                open={modalPreview}
                onClose={() => {
                    setModalPreview(false);
                    setPreview({});
                }}
                item={preview}
            />
            <ModalRename
                open={modalRename}
                onClose={() => {
                    setModalRename(false);
                    setCurrentItem(undefined);
                }}
                item={currentItem as any}
                actions={handleRename}
            />
            <ModalEdit
                disk={selectDisk}
                open={modalEdit}
                onClose={() => {
                    setModalEdit(false);
                    setCurrentItem(undefined);
                }}
                item={currentItem as any}
                actions={handleEdit}
            />
            <ModalNewFile
                open={modalNewFile}
                onClose={() => {
                    setModalNewFile(false);
                }}
                actions={handleNewFile}
            />
            <ModalNewFolder
                open={modalNewFolder}
                onClose={() => {
                    setModalNewFolder(false);
                }}
                actions={handleNewFolder}
            />
            <ModalUpload
                open={modalUpload}
                onClose={() => {
                    setModalUpload(false);
                    setFileUpload([]);
                }}
                onFileChange={setFileUpload}
                actions={handleUpload}
                multiple
            />
            <ModalDelete
                open={modalDelete}
                onClose={() => {
                    setModalDelete(false);
                }}
                actions={handleDelete}
            />
            <CardHeader className="border-b-1 border-b-dark">
                <Header
                    selected={
                        selectedList.length > 0
                            ? true
                            : currentItem
                            ? true
                            : false
                    }
                    clipboard={clipboard ? true : false}
                    setView={setView}
                    toggleReload={toggleReload}
                    toggleNewFile={toggleNewFile}
                    toggleNewFolder={toggleNewFolder}
                    toggleUpload={toggleUpload}
                    handleCopy={handleCopy}
                    handleCut={handleCut}
                    handlePaste={handlePaste}
                />
            </CardHeader>
            <CardContent>
                <Grid col="8">
                    <Col col="2" className="border-r-2 border-dark h-full">
                        <LeftContent
                            selectDisk={selectDisk}
                            setSelectFolder={setSelectFolder}
                        />
                    </Col>
                    <Col col="6">
                        <ListDisk
                            disks={disks}
                            selectDisk={selectDisk}
                            selectFolder={selectFolder}
                            setSelectDisk={setSelectDisk}
                            setSelectFolder={setSelectFolder}
                        />
                        {view == "list" ? (
                            <TableView
                                view={view}
                                disk={selectDisk}
                                directories={directories}
                                files={files}
                                current={currentItem}
                                currents={selectedList}
                                setSelectDisk={setSelectDisk}
                                handleMultipleClick={handleMultileClick}
                                handleOneClick={handleOneClick}
                                handleDoubleClick={handleDoubleClick}
                                handleDownload={handleDownload}
                                handleCopy={handleCopy}
                                handleCut={handleCut}
                                handlePaste={handlePaste}
                                toggleModalDetail={toggleModalDetail}
                                togglePreview={togglePreview}
                                toggleEdit={toggleEdit}
                                toggleRename={toggleRename}
                                toggleDelete={toggleDelete}
                            />
                        ) : (
                            <GridView
                                view={view}
                                disk={selectDisk}
                                directories={directories}
                                files={files}
                                current={currentItem}
                                currents={selectedList}
                                setSelectDisk={setSelectDisk}
                                handleMultipleClick={handleMultileClick}
                                handleOneClick={handleOneClick}
                                handleDoubleClick={handleDoubleClick}
                                handleDownload={handleDownload}
                                handleCopy={handleCopy}
                                handleCut={handleCut}
                                handlePaste={handlePaste}
                                toggleModalDetail={toggleModalDetail}
                                togglePreview={togglePreview}
                                toggleEdit={toggleEdit}
                                toggleRename={toggleRename}
                                toggleDelete={toggleDelete}
                            />
                        )}
                    </Col>
                </Grid>
            </CardContent>
        </Card>
    );
};
FileManager.displayName = "FileManager";
export default FileManager;
