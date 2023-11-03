import React, { ReactNode } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@min98/ui";
import { t } from "i18next";
interface AlertDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    children?: ReactNode;
    action?: () => void;
    cancel: () => void;
}

const Modal: React.FC<AlertDialogProps> = ({
    open,
    title,
    message,
    children,
    action,
    cancel,
}) => {
    const handleAction = () => {
        action?.();
    };
    const handleCancel = () => {
        cancel?.();
    };
    return (
        <AlertDialog open={open}>
            {/* <AlertDialogTrigger className="btn">
                            Open
                        </AlertDialogTrigger> */}
            <AlertDialogContent className="lg:!w-3/4 md:!w-full sm:!w-full">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>
                    {action ? (
                        <AlertDialogAction onClick={() => handleAction()}>
                            {t("common.confirm")}
                        </AlertDialogAction>
                    ) : null}
                    <AlertDialogCancel onClick={() => handleCancel()}>
                        {t("common.cancel")}
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Modal;
