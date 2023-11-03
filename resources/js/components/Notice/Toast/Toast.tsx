import React, {
    forwardRef,
    HTMLAttributes,
    useEffect,
    useState,
    useRef,
    ReactNode,
} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { animated, useSpring } from "@react-spring/web";

import CloseButton from "../../Button/CloseButton";

import { useForkedRef } from "../../../hooks/useForkedRef";
import { colorPropType } from "../../props";
import type { Colors } from "../../types";

import { Icon } from "@iconify/react";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Sets the variant context of the component to one of CoreUI’s themed variants.
     *
     * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
     */
    variant: Colors;
    /**
     * set the icon
     */
    icon?: ReactNode;
    /**
     * set the title
     */
    title?: string;
    /**
     * set the message
     */
    message?: any;
    /**
     * set the position
     */
    position?: string;
    /**
     * Optionally add a close button to alert and allow it to self dismiss.
     */
    dismissible?: boolean;
    /**
     * Callback fired when the component requests to be closed.
     */
    onClose?: () => void;
    /**
     * Set the light color.
     */
    light?: boolean;
    /**
     * Set the solid.
     */
    solid?: boolean;
    /**
     * Toggle the visibility of component.
     */
    visible?: boolean;
}
const duration = 4000;
const Toast = forwardRef<HTMLDivElement, ToastProps>(
    (
        {
            icon,
            title,
            children,
            className,
            variant = "primary",
            position = "top-right",
            dismissible,
            light = false,
            solid,
            visible = true,
            onClose,
            ...rest
        },
        ref,
    ) => {
        const alertRef = useRef<HTMLDivElement>(null);
        const forkedRef = useForkedRef(ref, alertRef);

        const [_visible, setVisible] = useState(visible);

        const styles = useSpring({
            opacity: _visible ? 1 : 0,
            y: _visible ? 0 : 24,
        });
        /**
         * set visible
         */
        useEffect(() => {
            setVisible(visible);
        }, [visible]);
        /**
         * clear notice handle
         */
        const clearNotify = () => {
            if (typeof onClose == "function") onClose();
        };
        /**
         * class position
         */
        const PositionClasses = classNames({
            "top-1/5 lg:left-1/3 md:left-0 sm:left-0": position === "center",
            "lg:top-20 md:top-25 lg:left-0 md:left-5 sm:left-5":
                position === "top-left",
            "lg:top-20 md:top-25 lg:right-0 md:right-5 sm:right-5":
                position === "top-right",
            "lg:bottom-20 md:bottom-25 lg:left-0 md:left-5 sm:left-5":
                position === "bottom-left",
            "lg:bottom-20 md:bottom-25 lg:right-0 md:right-5 sm:right-5":
                position === "bottom-right",
            "lg:top-20 md:top-25 lg:left-1/2 md:left-5 sm:left-5":
                position === "top-center",
        });
        /**
         * class text
         */
        const TextClass = solid
            ? [`text-${variant}${light ? "-dark" : ""}`]
            : [light ? `text-${variant}-dark` : "text-white"];
        /**
         * class color
         */
        const ToastClass = solid
            ? [
                  `border-2 border-${variant}`,
                  `bg-gray`,
                  `text-${variant}${light ? "-dark" : ""}`,
              ]
            : [
                  `border-2 border-${variant}`,
                  `bg-${variant}${light ? "-light" : ""}`,
                  `text-${variant}${light ? "-dark" : ""}`,
              ];

        /**
         * render icon follow variant
         */
        const RenderIcon = (status: any) => {
            const classIcon = classNames(
                solid
                    ? [`text-${variant}${light ? "-dark" : ""}`]
                    : light
                    ? `text-${variant}${light ? "-dark" : ""}`
                    : "text-white",
            );
            switch (status) {
                case "primary":
                    return (
                        <Icon
                            icon="tabler:circle-check"
                            className={classIcon}
                            fontSize={24}
                        />
                    );
                case "secondary":
                    return (
                        <Icon
                            icon="tabler:circle-check"
                            className={classIcon}
                            fontSize={24}
                        />
                    );
                case "success":
                    return (
                        <Icon
                            icon="tabler:circle-check"
                            className={classIcon}
                            fontSize={24}
                        />
                    );
                case "danger":
                    return (
                        <Icon
                            icon="tabler:alert-circle"
                            className={classIcon}
                            fontSize={24}
                        />
                    );
                case "warning":
                    return (
                        <Icon
                            icon="tabler:alert-small"
                            className={classIcon}
                            fontSize={24}
                        />
                    );
                case "info":
                    return (
                        <Icon
                            icon="tabler:exclamation-mark"
                            className={classIcon}
                            fontSize={24}
                        />
                    );
                default:
                    return (
                        <Icon
                            icon="tabler:circle-check"
                            className={classIcon}
                            fontSize={24}
                        />
                    );
            }
        };
        return (
            <animated.div style={styles}>
                <div
                    className={classNames(
                        "absolute z-9999 w-90 lg:p-3",
                        PositionClasses,
                    )}
                >
                    <div
                        className={classNames(
                            "toast px-3 border-2 border-l-6 shadow-md bg-opacity-[70%] dark:bg-opacity-[80%]",
                            className,
                            ToastClass,
                        )}
                        role="toast"
                        {...rest}
                        ref={forkedRef}
                    >
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-initial">
                                    {icon ? (
                                        <div className="ml-auto">{icon}</div>
                                    ) : (
                                        <div className="ml-auto mx-5">
                                            {RenderIcon(variant)}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-auto flex-1">
                                    <p
                                        className={classNames(
                                            "text-sm font-medium",
                                            TextClass,
                                        )}
                                    >
                                        {title}
                                    </p>
                                    <p
                                        className={classNames(
                                            "text-sm",
                                            TextClass,
                                        )}
                                    >
                                        {children}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            {dismissible || (
                                <CloseButton
                                    onClick={() => {
                                        setVisible(false);
                                        clearNotify();
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </animated.div>
        );
    },
);

Toast.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    variant: colorPropType.isRequired,
    title: PropTypes.string,
    dismissible: PropTypes.bool,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
};

Toast.displayName = "Toast";
export default Toast;
