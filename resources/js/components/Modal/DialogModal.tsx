import React from "react";
import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@min98/ui";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
interface DialogModalProps {
    className?: string;
    open: boolean;
    title?: string;
    desc?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    children?: React.ReactNode;
    action?: (data?: any) => void;
    cancel: () => void;
}
const DialogModal: React.FC<DialogModalProps> = ({
    className,
    open,
    title,
    desc,
    size,
    children,
    action,
    cancel,
}) => {
    const { t } = useTranslation();
    const handleAction = () => {
        action?.();
    };
    const handleCancel = () => {
        cancel?.();
    };
    return (
        <Dialog
            open={open}
            onOpenChange={(value: boolean) => {
                !value && handleCancel();
            }}
        >
            <DialogContent
                size={size}
                className={classNames(
                    "bg-white max-h-[100vh] dark:bg-dark overflow-y-scroll",
                    className,
                )}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{desc}</DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter className="sm:justify-start md:justify-end lg:justify-end">
                    {action && (
                        <Button
                            type="button"
                            color="success"
                            onClick={handleAction}
                        >
                            {t("common.save")}
                        </Button>
                    )}
                    <DialogClose asChild>
                        <Button type="button" color="secondary">
                            {t("common.close")}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default DialogModal;
