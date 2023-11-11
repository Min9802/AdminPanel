import React from "react";
import { Alert } from "@material-tailwind/react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
type Props = {
    open: boolean;
    variant: string;
    position: string;
    message: string | React.ReactNode;
    onClose: () => void;
};

const Toastify = ({ open, variant, position, message, onClose }: Props) => {
    const clearNotify = () => {
        if (typeof onClose == "function") onClose();
    };
    const RenderIcon = () => {
        switch (variant) {
            case "primary":
                return <Icon icon="tabler:circle-check" fontSize={24} />;
            case "secondary":
                return <Icon icon="tabler:circle-check" fontSize={24} />;
            case "success":
                return <Icon icon="tabler:circle-check" fontSize={24} />;
            case "danger":
                return <Icon icon="tabler:alert-circle" fontSize={24} />;
            case "warning":
                return <Icon icon="tabler:alert-small" fontSize={24} />;
            case "info":
                return <Icon icon="tabler:exclamation-mark" fontSize={24} />;
            default:
                return <Icon icon="tabler:circle-check" fontSize={24} />;
        }
    };
    const PositionClasses = classNames({
        "top-1/5 lg:left-1/3 md:left-5 sm:left-5": position === "center",
        "lg:-top-4 md:-top-4 lg:left-5 md:left-5 sm:left-5":
            position === "top-left",
        "lg:-top-4 md:-top-4 lg:right-5 md:right-5 sm:right-5":
            position === "top-right",
        "lg:-bottom-4 md:-bottom-4 lg:left-5 md:left-5 sm:left-5":
            position === "bottom-left",
        "lg:-bottom-4 md:-bottom-4 lg:right-5 md:right-5 sm:right-5":
            position === "bottom-right",
        "lg:-top-4 md:-top-4 lg:left-1/2 md:left-5 sm:left-5":
            position === "top-center",
    });
    return (
        <div
            className={classNames("lg:w-1/4 z-9999 absolute", PositionClasses)}
        >
            <Alert
                open={open}
                onClose={clearNotify}
                animate={{
                    mount: { y: 100 },
                    unmount: { y: 0 },
                }}
                // className={classNames(
                //     "flex md:w-2/5 lg:w-3/4 z-9999 flex-col gap-2 absolute",
                //     PositionClasses,
                // )}
                icon={<RenderIcon />}
                color="blue"
                action={
                    <Icon
                        icon="tabler:x"
                        onClick={clearNotify}
                        className="!absolute top-3 right-3"
                    />
                }
            >
                {message}
            </Alert>
        </div>
    );
};

export default Toastify;
