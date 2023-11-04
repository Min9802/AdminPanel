import React from "react";

import { useTranslation } from "react-i18next";
import { PreviewProps } from "../FileManager";
import ReactPlayer from "react-player";
import DialogModal from "@/components/Modal/DialogModal";
import { Label } from "@min98/ui";
interface ModalPreviewProps {
    open: boolean;
    onClose: () => void;
    item: PreviewProps;
}

const ModalPreview: React.FC<ModalPreviewProps> = ({ open, onClose, item }) => {
    const { t } = useTranslation();

    return (
        <DialogModal
            open={open}
            cancel={onClose}
            title={t("label.preview")}
            size="xl"
        >
            {item && item.type == "image" ? (
                <div className="items-center justify-center">
                    <Label>{item?.data?.title}</Label>
                    <img
                        className="object-scale-down h-100 ml-auto mr-auto"
                        src={item?.data?.src}
                    />
                </div>
            ) : item.type == "video" || item.type == "audio" ? (
                <div className="ml-auto mr-auto">
                    <Label className="text-center">{item?.data?.title}</Label>
                    <ReactPlayer
                        width={"auto"}
                        height={"auto"}
                        url={[
                            {
                                src: item?.data?.src as string,
                                type: item?.data?.type,
                            },
                        ]}
                        controls={true}
                        muted={true}
                        onReady={() => console.log("onReady")}
                    />
                </div>
            ) : // <Plyr

            null}
        </DialogModal>
    );
};

export default ModalPreview;
