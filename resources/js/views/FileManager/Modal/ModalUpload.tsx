import DialogModal from "@/components/Modal/DialogModal";
import { ImageConfig } from "@/configs/constant";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@min98/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { bytesToHuman } from "../Utils/FileUtils";

interface ModalUploadProps {
    open: boolean;
    onClose: () => void;
    actions: () => void;
    onFileChange: (data: any) => void;
    multiple?: boolean;
}

const ModalUpload: React.FC<ModalUploadProps> = ({
    open,
    onClose,
    actions,
    onFileChange,
    multiple,
}) => {
    const { t } = useTranslation();
    const [files, setFiles] = React.useState<File[]>([]);
    const AreaRef = React.useRef<HTMLDivElement | null>(null);
    /**
     * handle Submit
     */
    const handleSubmit = () => {
        actions?.();
        setFiles([]);
    };
    /**
     * on file Drop
     * @param e
     */

    const handleFileDrop = React.useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
                const updatedList = multiple ? [...files] : [];
                const newFiles = Array.from(e.dataTransfer.files);
                for (const file of newFiles) {
                    updatedList.push(file);
                }
                setFiles(updatedList);
                onFileChange(updatedList);
            }
        },
        [files, multiple, onFileChange],
    );
    const handleDragOver = React.useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
        },
        [],
    );
    const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (multiple && e.target.files) {
            const updatedList = [...files];
            const newFile = e.target.files;
            for (const file of Object.values(newFile)) {
                updatedList.push(file);
            }
            setFiles(updatedList);
            onFileChange(updatedList);
        } else if (e.target.files) {
            const updatedList = [];
            const newFile = e.target.files[0];
            updatedList.push(newFile);
            setFiles(updatedList);
            onFileChange(updatedList);
        }
    };

    /**
     * file remove
     * @param file
     */
    const fileRemove = (file: File) => {
        const updatedList = [...files];
        updatedList.splice(files.indexOf(file), 1);
        setFiles(updatedList);
        onFileChange(updatedList);
    };
    /**
     * get type file
     * @param fileType
     * @returns
     */
    const getFileType = (fileType: string) => {
        const type: string = fileType.split("/")[1];
        return ImageConfig[type] || ImageConfig.default;
    };
    const onCancel = () => {
        onClose();
        setFiles([]);
    };
    return (
        <DialogModal
            open={open}
            cancel={onCancel}
            title={t("label.uploadfile")}
            action={handleSubmit}
            size="xl"
        >
            <Card>
                <CardContent>
                    <div
                        className="max-w-xl"
                        ref={AreaRef}
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                    >
                        <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                            <span className="flex items-center space-x-2">
                                <Icon
                                    icon="mdi:cloud-arrow-up-outline"
                                    color="green"
                                    fontSize={35}
                                />
                                <span className="font-medium text-gray-600">
                                    {t("label.drag-drop")}
                                    <span className="text-blue-600 underline">
                                        {", or browse"}
                                    </span>
                                </span>
                            </span>
                            <input
                                type="file"
                                name="files"
                                className="hidden"
                                onChange={onFileDrop}
                                multiple={multiple || false}
                            />
                        </label>
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-2">
                        {files.map((file, k) => {
                            return (
                                <div
                                    key={k}
                                    className="flex flex-row items-center"
                                >
                                    <img
                                        className="max-h-10"
                                        src={getFileType(file.type)}
                                        alt=""
                                    />
                                    <div className="text-left">
                                        <p className="text-dark text-sm break-all">
                                            {file.name}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {bytesToHuman(file.size)}
                                        </p>
                                    </div>
                                    <Icon
                                        className="ml-auto cursor-pointer"
                                        icon="tabler:x"
                                        color="red"
                                        fontSize={25}
                                        onClick={() => fileRemove(file)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </DialogModal>
    );
};

export default ModalUpload;
