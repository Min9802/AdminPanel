import { Modal } from "@min98/ui";
import React from "react";
import { useTranslation } from "react-i18next";

interface ModalDeleteProps {
    open: boolean;
    onClose: () => void;
    actions?: () => void;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
    open,
    onClose,
    actions,
}) => {
    const { t } = useTranslation();
    return (
        <Modal
            open={open}
            cancel={onClose}
            title={t("label.delete")}
            action={actions}
        >
            <h4 className="text-red-500">{t("ask.delete")}</h4>
        </Modal>
    );
};

export default ModalDelete;
