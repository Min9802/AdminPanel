import React from "react";
import classNames from "classnames";
import { Icon } from "@iconify/react";

import { useTranslation } from "react-i18next";
import { Button } from "@min98/ui";
interface AlertProps {
    isOpen: any;
    icon?: React.ReactElement;
    status?: string;
    position?:
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"
        | "center"
        | "top-center";
    size?: "sm" | "md" | "lg";
    title?: string;
    message: React.ReactNode | string;
    btnFooter?: string;
    onClose: () => void;
    callback?: () => void;
}

const Alert: React.FC<AlertProps> = ({
    isOpen,
    position = "center",
    size = "md", // Default size is medium if not specified
    icon,
    status = "primary",
    title,
    message,
    btnFooter,
    onClose,
    callback,
}) => {
    const [open, setOpen] = React.useState(isOpen);
    React.useEffect(() => {
        setOpen(isOpen);
    }, [open]);
    const { t } = useTranslation();
    const BLOCK_SCROLL_CLASS = "block-scroll";
    React.useEffect(() => {
        // Add or remove the block-scroll class to body based on modal visibility
        if (open) {
            document.body.classList.add(BLOCK_SCROLL_CLASS);
        } else {
            document.body.classList.remove(BLOCK_SCROLL_CLASS);
        }
    }, [open]);

    const RenderIcon = () => {
        const classIcon = classNames(`text-${status}-light px-3`);
        switch (status) {
            case "primary":
                return (
                    <Icon
                        icon="tabler:circle-check"
                        className={classIcon}
                        fontSize={60}
                    />
                );
            case "secondary":
                return (
                    <Icon
                        icon="tabler:circle-check"
                        className={classIcon}
                        fontSize={60}
                    />
                );
            case "success":
                return (
                    <Icon
                        icon="tabler:circle-check"
                        className={classIcon}
                        fontSize={60}
                    />
                );
            case "danger":
                return (
                    <Icon
                        icon="tabler:alert-triangle"
                        className={classIcon}
                        fontSize={60}
                    />
                );
            case "warning":
                return (
                    <Icon
                        icon="tabler:alert-triangle"
                        className={classIcon}
                        fontSize={60}
                    />
                );
            case "info":
                return (
                    <Icon
                        icon="tabler:alert-small"
                        className={classIcon}
                        fontSize={60}
                    />
                );
            default:
                return (
                    <Icon
                        icon="tabler:circle-check"
                        className={classIcon}
                        fontSize={60}
                    />
                );
        }
    };
    const modalPositionClasses = classNames({
        "lg:top-1/4 lg:left-1/3 md:left-0 sm:left-0": position === "center",
        "top-23 lg:left-10 sm:left-0 md:left-0": position === "top-left",
        "top-23 lg:right-10 sm:right-0 md:right-0": position === "top-right",
        "bottom-23 lg:left-10 sm:left-0 md:left-0": position === "bottom-left",
        "bottom-23 lg:right-10 sm:right-0 md:right-0":
            position === "bottom-right",
        "top-25 lg:left-1/2 sm:left-0 md:left-0": position === "top-center",
    });

    const modalSizeClasses = classNames({
        "lg:w-48": size === "sm",
        "lg:w-96": size === "md",
        "lg:w-120": size === "lg",
    });

    return (
        <div>
            {open && (
                <div className="fixed h-full top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-50"></div>
            )}
            {open && (
                <div
                    className={classNames(
                        "absolute z-9999 lg:p-3 mx-4",
                        modalPositionClasses,
                    )}
                >
                    <div
                        className={`p-4 bg-white dark:bg-boxdark rounded-lg shadow-lg ${modalSizeClasses}`}
                    >
                        {/* Modal header */}
                        <div className="flex justify-center items-center border-b">
                            <div className="flex flex-col justify-center items-center">
                                <div className="">
                                    {icon ? icon : <RenderIcon />}
                                </div>
                                <h2
                                    className={classNames(
                                        "text-xl text-center font-semibold",
                                        `text-${status}-dark`,
                                        `dark:text-white`,
                                    )}
                                >
                                    {title}
                                </h2>
                            </div>
                            <button
                                className="absolute -top-1 -right-1 bg-gray flex justify-center items-center rounded-full h-8 w-8 cursor-pointer shadow-xl"
                                onClick={onClose}
                            >
                                <Icon
                                    icon="tabler:x"
                                    color="red"
                                    fontSize={20}
                                />
                            </button>
                        </div>
                        {/* Modal content */}
                        <div className="flex justify-center items-center py-5">
                            <div className="flex-col">
                                <h2
                                    className={classNames(
                                        "text-xl text-center font-semibold",
                                    )}
                                >
                                    {message}
                                </h2>
                            </div>
                        </div>
                        <div className="footer-modal">
                            <div className="flex space-x-4 flex justify-end">
                                {callback && btnFooter ? (
                                    <Button color="success" onClick={callback}>
                                        {btnFooter}
                                    </Button>
                                ) : null}
                                <Button color="danger" onClick={onClose}>
                                    {t("common.close")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Alert;
